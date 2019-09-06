var json,
	bookmarkJsonRoot, bookmarkHTMLRoot,
	downloadDocument;

function init() {
   json = JSON.parse(content.fileContent);
   downloadDocument = document.implementation.createHTMLDocument("Bookmark");

   document.getElementById("downloadBox").style.visibility = "visible";
   document.getElementById("downloadButton").addEventListener("click", function(){
      download("Bookmark.html", downloadDocument.documentElement.innerHTML, "text/html");
   }, false);

   createHtmlStructure();
}

function createHtmlStructure() {
	// set custom doctype for Booksmarks
   let doctype = downloadDocument.implementation.createDocumentType("NETSCAPE-Bookmark-file-1", "", "");
   if (downloadDocument.doctype)
      downloadDocument.replaceChild(doctype, downloadDocument.doctype);
   else
      downloadDocument.insertBefore(doctype, downloadDocument.childNodes[0]);

   var structureElements = [
         title = downloadDocument.createElement("title"),
         heading = downloadDocument.createElement("h1"),
         meta = downloadDocument.createElement("meta")];

   title.appendChild(downloadDocument.createTextNode("Bookmarks"));

   heading.appendChild(downloadDocument.createTextNode("Bookmarks"));

   meta.setAttribute("HTTP-EQUIV", "Content-Type");
   meta.setAttribute("content", "text/html; charset=utf-8");

   for (var structureElement of structureElements)
      downloadDocument.childNodes[1].appendChild(structureElement);

   parseToHtml(json);
}

function parseToHtml(jsonData) {
   var generealList = downloadDocument.createElement("dl");
   var container = downloadDocument.createElement("dt");
   generealList.appendChild(container);

   var heading = downloadDocument.createElement("h3");
   heading.appendChild(downloadDocument.createTextNode(jsonData.roots.bookmark_bar.name));
   heading.setAttribute("ADD_DATE", jsonData.roots.bookmark_bar.date_added);
   heading.setAttribute("LAST_MODIFIED", jsonData.roots.bookmark_bar.date_modified);
   heading.setAttribute("PERSONAL_TOOLBAR_FOLDER", true);
   container.appendChild(heading);

   bookmarkHTMLRoot = downloadDocument.childNodes[1].appendChild(generealList);
   bookmarkJsonRoot = jsonData.roots.bookmark_bar;

   readChildren(bookmarkJsonRoot, bookmarkHTMLRoot);
}

function readChildren(data, htmlParent) {
   var currentFolder = htmlParent;
   for (var child of data.children) {

      switch (child.type) {
         case "folder":
            currentFolder = createFolder(htmlParent, child);
            break;

         case "url":
            createLink(currentFolder, child);
            break;

         default:
            console.error("Unable to read correct bookmark-type. Type:" + child.type);
            break;
      }

      if (child.hasOwnProperty("children"))
         readChildren(child, currentFolder);
   }
}

function createFolder(parent, path) {
   var   folderList = downloadDocument.createElement("dl"),
		   container = downloadDocument.createElement("dt"),
		   meta = downloadDocument.createElement("h3");

   meta.appendChild(downloadDocument.createTextNode(path.name));
   meta.setAttribute("ADD_DATE", path.date_added);
   meta.setAttribute("LAST_MODIFIED", path.date_modified);

   container.appendChild(meta);
   folderList.appendChild(container);
   parent.appendChild(folderList);
   return folderList;
}

function createLink(parent, path) {
   var container = downloadDocument.createElement("dt"),
	   url = downloadDocument.createElement("a");

   url.appendChild(downloadDocument.createTextNode(path.name));
   url.setAttribute("HREF", path.url);
   url.setAttribute("ADD_DATE", path.date_added);
   container.appendChild(url);
   parent.appendChild(container);
   return container;
}

function download(filename, text, type) {
   var downloadLink = document.createElement("a");
   var file = new Blob([text], {type: type});

   downloadLink.href = URL.createObjectURL(file);
   downloadLink.download = filename;

   downloadLink.style.display = "none";
   document.body.appendChild(downloadLink);
   downloadLink.click();
}







