# rhyssoft.com

This site uses Vue 3. Look at the [Vue 3](https://vuejs.org) to learn more.

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

I am using Google Cloud to host the website. To set up my environment, I ran 
the following commands:

```bash
gcloud auth login
gcloud config set project rhyssoft-com-website
gcloud auth application-default login
```

I created the bucket for holding terraform state through the Google Cloud 
console.

Then I initialised terraform and looked at the plan, to see what terraform
was intending to do (in this case, create everything):
```bash
cd terraform_gcc
terraform init
terraform plan
```

If you're happy with the plan, you can run:

```bash
terraform apply
```

and type 'yes' to apply the changes.

### Terraform state
The terraform state is held in a Google Cloud Storage bucket called 
`rhyssoft-tfstate`. This was created manually, and is not part of the terraform 
set up.


### Building and deploying the site
To build run:

```bash
npm run build
```

This will create a `dist` directory with the code to deploy.

Copy files to Google Cloud storage bucket:
```bash
cd dist
gsutil rm -r gs://www.rhyssoft.com/*
gsutil cp -r . gs://www.rhyssoft.com
```

### Code highlighting
See [Prism](https://prismjs.com/#supported-languages)

