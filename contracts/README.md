# trusty

Trusty! is a reputation and reporting tool designed to help DAOs maintain a strong community culture and a high trust environment, in a trustless and decentralised manner. We are applying for the Robust Democracy track, as we believe one of the hardest problems in Plural decentralised democratic systems is maintaining trust for the vote that occurs within your community as it scales in size. The weight of your vote and therefore influence on decisions should be a function of your contributions and reputation within that community, as decisions made that impact the DAO are best decided by those that have the most skin in the game. As projects grow in a decentralised fashion, it is challenging to maintain a culture that befits the original vision. LvlUP! provides a flexible and gamified solution to rewarding those that contribute the most, decided by the most reputable contributors.

LvlUP! leverages Scroll network's L1SLOAD and ENS subdomains to faciltate the creation of "Ranks" (DAO-specific subdomains, displaying rank internal to the community), based on a reputation score. The reputation score is determined through the use of "Votes" (simple yes/no endorsement of work statements, with onchain transaction execution) which issue "Points" to the reputation score. The higher your Rank, the more Points your Vote issues.

The concept of Ranks allows DAO participants to issue endorsements to each other, based on judgements of Work Statements, giving more voting weights to those with a higher Rank and thus reputation. This can scale to all DAO governance proposals such that higher ranking DAO members can have a higher weighted vote in Proposals. Reputation Score issues ranks based on a Sigma Function, to ensure a better distribution of Ranks among the DAO. 

Key features of trusty Rank scores:

- Your Vote casts Points equivalent to your Rank. (i.e. Rank 1 = 1 Point, Rank 4 = 4 points)

- Your Rank issues you a subdomain (i.e. expert.dan.tokyodao1.eth) for display purposes within your DAO

- The sigma function of Rank distribution can be adjusted to fit your DAO's needs.

## App

Url: https://ethtokyo-trusty.vercel.app/

### Wallets

- As for PK of wallets or we can register your wallet as a user

## Deployments

### Sepolia

TrustyEnsUsers: [`0xE37881258A5c1dA765a3566F7D2A3EE7f91B8264`](https://sepolia.etherscan.io/address/0xE37881258A5c1dA765a3566F7D2A3EE7f91B8264)

### Scroll Devnet

>NOTE: BlockScout doesn't verify the contracts 

L1EnsResolver: [`0x20fC645Da540143886c1F604517333050812A29e`](https://l1sload-blockscout.scroll.io/address/0x20fC645Da540143886c1F604517333050812A29e)
BasicRankFunction: [`0x82EcDC2cF4dAF0BB7F4De1cEdbAb8d6237EdD340`](https://l1sload-blockscout.scroll.io/address/0x82EcDC2cF4dAF0BB7F4De1cEdbAb8d6237EdD340)
Factory: [`0xebcB8dFbb54b311C929A4294ba34620c5a70D67D`](https://l1sload-blockscout.scroll.io/address/0xebcB8dFbb54b311C929A4294ba34620c5a70D67D)
Space: [`0x46F7266d14F400665aD36CBd53Cc8Dd8bAc99482`](https://l1sload-blockscout.scroll.io/address/0x46F7266d14F400665aD36CBd53Cc8Dd8bAc99482)
