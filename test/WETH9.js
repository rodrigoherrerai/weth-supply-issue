const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");
const { ethers } = require("hardhat");

const oneEth = ethers.utils.parseEther("1");

describe("WETH9", function () {
  async function deployWethFixture() {
    const [signer] = await ethers.getSigners();

    const Weth = await ethers.getContractFactory("WETH9");
    const weth = await Weth.deploy();

    const SelfDestruct = await ethers.getContractFactory("SelfDestruct");
    const selfDestruct = await SelfDestruct.deploy();

    return { weth, selfDestruct, signer };
  }

  describe("Deployment", () => {
    it("should have 0 as initial Eth balance", async () => {
      const { weth } = await deployWethFixture();

      const balance = await ethers.provider.getBalance(weth.address);
      expect(balance).to.equal(0);
    });

    it("should have 0 as initial totalSupply()", async () => {
      const { weth } = await deployWethFixture();

      const balance = await weth.totalSupply();
      expect(balance).to.equal(0);
    });
  });

  describe("Weth incorrect total supply", () => {
    it("should have more Eth than WETH", async () => {
      const { weth, selfDestruct, signer } = await deployWethFixture();

      // First we will fund the selfDestruct contract to have 1 eth.
      await signer.sendTransaction({
        to: selfDestruct.address,
        value: oneEth,
      });

      // It should have 1 eth.
      expect(await ethers.provider.getBalance(selfDestruct.address)).to.equal(
        oneEth
      );

      // Now, we will call selfDestruct with the Weth9 as target.
      await selfDestruct.destruct(weth.address);

      // Should have 0 balance.
      expect(await ethers.provider.getBalance(selfDestruct.address)).to.equal(
        0
      );

      // Should not have any code.
      const code = await ethers.provider.getCode(selfDestruct.address);
      expect(code).to.equal("0x");

      /**
       * totalSupply returns the Eth balance, not weth.
       *
       * Eth balance is 1, but weth was never minted, because the fallback
       * function was never triggered.
       */
      expect(await ethers.provider.getBalance(weth.address)).to.equal(oneEth);

      // Weth balance of selfDestruct is 0.
      expect(await weth.balanceOf(selfDestruct.address)).to.equal(0);
    });
  });
});
