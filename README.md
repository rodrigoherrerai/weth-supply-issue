# Weth Supply

This proof of concept was inspired by [this twitter thread](https://twitter.com/gf_256/status/1593060248805310465)

The main discovery is that the Weth9 contract "totalSupply()" getter can be inaccurate.

- totalSupply() returns the Eth balance not the Weth balance:

```sol
function totalSupply() public view returns (uint) {
        return this.balance;
    }
```

- When transferring Eth through selfDestruct, the fallback function of the receiver contract won't be triggered, therefore the equivalent Weth won't be minted. This will cause the Weth contract to have more Eth than Weth, therefore the "totalSupply" function won't be accurate.

## Usage

Install:

```
npm i
```

Test:

```
npm run test
```

## Note

This is not a problem because there will always be more Eth than Weth minted.
