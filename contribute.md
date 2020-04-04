ofDocs aims to make contributing to openFrameworks documentation easier by allowing direct editing of markdown files within the app. This will write changes to disk, so will only work when running ofDocs locally, after which changes can be submitted via Github.


To set up ofDocs locally you can follow the instructions in the root [README](/), and clone [ofSite](https://github.com/openframeworks/ofSite). Be sure to also read the original [submission guidelines](https://openframeworks.cc/learning/08_other/contributing/) which contain instructions for structure and formatting.


Changes can then be submitted via the [command line](https://github.com/jd/git-pull-request), via [Github](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) or with a [desktop client](https://desktop.github.com/). For example:


```

# using a Python pull request helper

pip3 install git-pull-request

# after editing a page within ofSite...

cd openFrameworks/ofSite
git branch my-new-edits
git commit -a -m "updated description for ofArduino"
git pull-request

```