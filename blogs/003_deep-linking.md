# Deep linking
2024-03-06

Why my blog links led to a key not found error.

I was testing the link to my last blog entry (https://www.rhyssoft.com/blog/1)
and discovered that it led to 404. It worked fine if I navigated to the index
(https://www.rhyssoft.com/) and then clicked on a link to the blog, which 
displayed the URL path as `/blog/1`; but if I pasted the link to the blog into
the address bar, I got a 404 (page not found).

The reason is that I am using the Vue Router to navigate through the web app.
The blog is a single page application (SPA), at the moment. When clicking the 
link, although the path changes to look as it would if it were accessing a 
different resource from the server, in fact no such resource is fetched. Instead, 
the web application handles the 'link' itself by displaying a different component, 
with the context of the first blog (which is some JavaScript state). 

There is no simple fix this when using Google buckets to serve the files. The
workaround is to define the `not_found_page` to be the same as the  
`main_page_suffix` in terraform:

```hcl
resource "google_storage_bucket" "rhyssoft_com" {
  name     = "www.rhyssoft.com"
  # The name is what matches the bucket to the hostname
  location = "europe-west2"
  project  = "rhyssoft-com-website"

  public_access_prevention    = "inherited"
  uniform_bucket_level_access = false # needs to be false to apply an acl

  versioning {
    enabled = false
  }

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}
```

Applying this change (previously it served a `404.html` page), fixes the issue.
But it is not a great fix, because it means that any resource request that 
doesn't exist on the server will return the `index.html` page.

I can live with this for now. Eventually I want to change how I build the website
to generate the HTML pages. Valid paths will all be resolvable using actual
resources, and a 404 can be a 404 again.
