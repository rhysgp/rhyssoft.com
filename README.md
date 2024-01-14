# rhyssoft.com

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Infrastructure as Code - terraform
Terraform defines the AWS infrastructure used to host the site. The site is stored
in S3, which can be used to deliver over HTTP. 

### Deploying the infrastructure
You need terraform installed - I'm currently using version 1.6.6. To deploy or 
amend the infrastructure, first set up an environment variable that has the AWS 
profile you're using to access your AWS account:

```bash
export AWS_PROFILE=rhyssoft
```

You will need the profile (in this case, `rhyssoft`) to be set up in your 
`~/.aws/credentials` file. Next, change to the terraform directory, initialise
it and show the plan of what terraform will change:

```bash
cd terraform
terraform init
terraform plan
```

If you're happy with the plan, you can run:

```bash
terraform apply
```

and type 'yes' to apply the changes.

### Terraform state
The terraform state is held in an S3 bucket called `rhyssoft-tfstate`. This was 
created manually, and is not part of the terraform set up.


### Building and deploying the site
Nuxt support Static Site Generation (SSG), which is one of the reasons I'm using
Nuxt. To build the site, in the project directory, run:

```bash
npx nuxi generate
```

This will create a `dist` directory (actually a soft link to .output/public).

To deploy these, run:
```bash
cd dist
aws s3 cp --recursive --profile rhyssoft --sse=AES256 . s3://rhyssoft-com/
```

(you may have a different profile name — it should match what you have in your
.aws/credentials file).
