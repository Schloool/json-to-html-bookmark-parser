var downloadBox,
    content = {
    fileContent: null
};

document.addEventListener("DOMContentLoaded", function() {
    var dropZone = document.getElementById("upload");
    downloadBox = document.getElementById("downloadBox");
    downloadBox.style.visibility= "collapse";

    dropZone.addEventListener("dragover", onDragOver, false);
    dropZone.addEventListener("dragleave", resetBoxColor, false);
    dropZone.addEventListener("drop", onFileChoose, false);
});
 
function onFileChoose(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var chosenFiles = evt.dataTransfer.files;
    
    if (chosenFiles.length > 1){
        resetBoxColor();
        alert("You are only allowed to upload one File.");
        return;
    }
    
    if (!chosenFiles[0].name.endsWith(".json")) {
        resetBoxColor();
        alert("Please upload a " + '"' + ".json" + '"' + "-file!");
        return;
    }

    var uploadSuccessText = document.createElement("p");
    uploadSuccessText.appendChild(document.createTextNode('"' + chosenFiles[0].name + '"' + " has been uploaded successfully!" ));
    uploadSuccessText.setAttribute("class", "confirmation");
    downloadBox.appendChild(uploadSuccessText);
    document.getElementById("uploadText").remove();
    resetBoxColor();

    // upload
    uploadFile = chosenFiles[0];
    var reader = new FileReader();
    
    reader.onload = function (fileData) {     
        uploadFile.fileData = fileData.target.result;
        content.fileContent = uploadFile.fileData;
        init();
    }
    reader.readAsText(uploadFile);
}

function onDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect="copy";
    document.getElementById("upload").style.background = "gray";
}

function resetBoxColor() {
    document.getElementById("upload").style.background = "white";
}
