const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer, seller

    beforeEach(async () => {
        [buyer, seller, signer] = await ethers.getSigners()
        

        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(seller.address);


        // List skins
        transaction = await escrow.connect(seller).listSkin(1, tokens(10), tokens(5))
        await transaction.wait()

        transaction = await escrow.connect(seller).listSkin(2, tokens(5), tokens(4))
        await transaction.wait()

        transaction = await escrow.connect(seller).listSkin(3, tokens(100), tokens(80))
        await transaction.wait()

    })

    describe('Deployment', () => {
        it('Returns seller address', async () => {
            const result = await escrow.seller()
            expect(result).to.be.equal(seller.address)
        })
    })

    describe('Listing', () => {
      it('Lists skins', async () => {
        result = await escrow.listedSkins(1);
        expect(result).to.be.equal(true);

        result = await escrow.listedSkins(2);
        expect(result).to.be.equal(true);

        result = await escrow.listedSkins(3);
        expect(result).to.be.equal(true);
      })

      it('Checks that there are currenly no buyers', async () => {
        result = await escrow.buyer(1);
        console.log(ethers.constants);
        expect(result).to.be.equal(ethers.ZeroAddress);
      })

      it('Returns the ask price', async () => {
        result = await escrow.askPrice(1);
        expect(result).to.be.equal(tokens(10));
      })

      it('Returns the min bid price', async () => {
        result = await escrow.minBidPrice(1);
        expect(result).to.be.equal(tokens(5));
      })

      it('Returns escrow balance', async () => {
        result = await escrow.escrowBalance(1);
        expect(result).to.be.equal(0)
      })

    })

    describe('Deposits', () => {
      it('Deposits funds for skin', async () => {
        transaction = await escrow.connect(buyer).purchase(1, {value: tokens(10)});
        await transaction.wait();

        result = await escrow.buyer(1);
        expect(result).to.be.equal(buyer.address);
        expect(await escrow.getBalance()).to.be.equal(tokens(10));
        expect(await escrow.escrowBalance(1)).to.be.equal(tokens(10));
      })

      it('Attempts to deposit funds for skin, but not enough', async () => {

        try {
            transaction = await escrow.connect(buyer).purchase(3, {value: tokens(10)});
            await transaction.wait();

            expect.fail('Transaction did not revert as expected');
        } catch (error) {
            // Assert that the error is an Ethereum revert error
            expect(error.message).to.contain('Not enough funds to purchase this skin');
            
            result = await escrow.buyer(3);
            expect(result).to.be.equal(ethers.ZeroAddress);
            expect(await escrow.getBalance()).to.be.equal(tokens(0));
            expect(await escrow.escrowBalance(3)).to.be.equal(tokens(0));
        }



      })

    })

    describe('Sale', async () => {
        beforeEach(async () => {
          transaction = await escrow.connect(buyer).purchase(1, {value: tokens(10)});
          await transaction.wait();
          transaction = await escrow.connect(seller).approveSale(1);
          await transaction.wait();
          transaction = await escrow.connect(buyer).approveSale(1);
          await transaction.wait();
        })

        it('Finalizes a sale', async () => {
          expect(await escrow.escrowBalance(1)).to.be.equal(tokens(10));
          expect(await escrow.getBalance()).to.be.equal(tokens(10));


          transaction = await escrow.finalizeSale(1);
          await transaction.wait();
          expect(await escrow.escrowBalance(1)).to.be.equal(tokens(0));
          expect(await escrow.getBalance()).to.be.equal(tokens(0));
        })

    })

})
