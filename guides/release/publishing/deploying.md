Most Cardstack users will not have to worry about deployment. In the future, they will be invited to join a project that is already set up and managed by Cardstack, also known as Card Space.

However, some organizations may choose to run and manage their own servers. Deployment of a Cardstack project varies by cloud provider. To see an example deployment pipeline to AWS, see these scripts and Docker containers for [`cardhost`](https://github.com/cardstack/cardstack/tree/master/packages/cardhost/deploy).

If you want to set up your own independent deployment environment, you would need resources such as the following:

- A place for back-end servers (Docker containers) and the environment variables they need (i.e. EC2)
- A place to save and retrieve Docker images
- A place for front-end assets
- A database
- A place to save cards, such as a repository on GitHub
- HTTPS certificates and domains
- Configuration to allow these resources access to one another
- A bastion host is highly recommended to keep your servers secure
- A logging service is highly recommended so that you can monitor and debug your servers easily.
The logs found inside Docker containers can be cumbersome to access
- A way to manage keypairs that allow developer `ssh` access
- A mechanism for user registration and authentication

## Examples

You can choose your own testing, deployment, and data persistence structure. However, it may be helpful to know one possible configuration,
which you will see reflected in our deploy scripts for `cardhost`.

The Cardstack Core Team prefers using GitHub Actions for continuous integration testing and deployment of Cardstack projects.
We generally deploy to AWS, making use of S3 for the front end assets and EC2 for the Hub's Docker containers.
Cards themselves are saved to private GitHub repositories by default.
