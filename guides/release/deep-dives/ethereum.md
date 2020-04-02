In the Cardstack ecosystem, data is saved to git by default. But what should someone do for actually hosting their git repository? For most users, services like GitHub makes sense, but for others, a decentralized git solution is necessary. For this reason, the Cardstack Team has created [`Githereum`](https://github.com/cardstack/githereum).

Githereum is a smart contract and set of tools that aim to be a distributed replacement for centralized repository hosting. It consists of an ethereum smart contract and a CLI for interacting with it.

The contract allows administering and sharing repositories, the state of which is tracked on-chain. This allows setting owners and writers, offering distributed control of who has access to a repository, along with cryptographic guarantees that different users have the same view of the state of the repository.

Storage is off-chain, with a pluggable storage back end that supports S3, IPFS, Google Drive, and more.

To learn more, check out the source code for [`Githereum`](https://github.com/cardstack/githereum).
