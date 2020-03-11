When ran locally, it is possible to edit markdown files within ofDocs and save the changes directly to disk. To set up ofDocs locally follow instructions in the root [README](/). By default ofDocs renders markdown files named index, readme or introduction as the folder root, ie. _/documentation/communication_ renders _/documentation/communication/introduction.markdown_. The API can also only overwrite markdown files defined within docs.config.json. Once some edits have been made you can submit the changes using a pull request:

```
pip3 install git-pull-request
# install CLI pull request wizard
cd openFrameworks/ofSite
git branch my-new-edits
git commit -a -m "updated description for ofArduino"
git pull-request
```