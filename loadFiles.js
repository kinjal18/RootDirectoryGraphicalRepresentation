const fs = require('fs');
const path = require('path');
const vis = require('vis');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;

const url = require('url');
const os = require('os');
const dialog = electron.remote.dialog;

let startingDir = "C:\\Users\\" + os.userInfo().username + "\\Videos";


//let directory;
let tempSub = new Set();
let subEdges = [];

let string = [];
let tempArr = [];
let finalNodeList = new Set();
let indexOfDir;
let addWindow;
let filePaths = [];

// create an array with nodes
var nodes = new vis.DataSet([{}]);

var edges = new vis.DataSet([{}]);
//Handle create add window
function createAddWindow(example)
{
    //Create new window
    addWindow = new BrowserWindow({
        width: 500,
        height: 500,
        title: 'Create File'
    });

    //Load HTML file into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

   
} 
var getFiles = function(path, files)
{
    fs.readdirSync(path).forEach(function(file)
    {
        var subpath = path + '\\' + file;
        if(fs.lstatSync(subpath).isDirectory())
        {
            getFiles(subpath, files);
        } else 
        {
            files.push(path + '\\' + file);
        }
    });     
    
}


createVerticesAndEdges(startingDir, filePaths, subEdges, string, tempArr, tempSub, nodes, edges);
function createVerticesAndEdges(directory, filePaths, subEdges, string, tempArr, tempSub, nodes, edges)
{
        nodes.clear();
        edges.clear();
        let numNode = 0;
        let firstNode = path.basename(directory);

        nodes.add({id: numNode, label: firstNode, group: 'folders'});
        getFiles(directory, filePaths);
        
        //Go through all filepaths and separate files and folders in the main directory
        for(let j = 0; j < filePaths.length; j++)
        {
            let currP = path.join(filePaths[j], '../');
            //console.log(path.basename(currP));
            if(path.basename(currP) === firstNode)
            {
                tempArr.push({type: 'files', name: path.basename(filePaths[j]), path: filePaths[j]});
            }
            else
            {
                tempArr.push({type: 'folders', name: path.basename(currP), path: filePaths[j]});
            }
        }

        
        numNode = numNode + 1;
        // create an array with edges
        

        for(let u = 0; u < tempArr.length; u++)
        {
        
        if(tempArr[u].type === 'folders')
            {
            string.push((tempArr[u].path.split(path.sep)));
            }
        }

        //Delete duplicates from tempArr;
        const filteredArr = tempArr.filter(el => {
            const duplicate = finalNodeList.has(el.name);
            finalNodeList.add(el.name);
            return !duplicate;
        })

        //Create nodes for files and folders in the main directory
        for(let i = 0; i < filteredArr.length; i++)
        {
            
            nodes.add({id: numNode, label: filteredArr[i].name, group: filteredArr[i].type, title: "Popup!"});
            if(filteredArr[i].type === 'files')
            {
                edges.add({from: 0, to: numNode});
            }
            numNode = numNode + 1;
        }
        //Create nodes for files in subfolders
        for(let i = 0; i < string.length; i++)
        {
            {
                let j = string[i].length -1;
                if(string[i][j].includes('.ini') === false)
                {
                    nodes.add({id: numNode, label: string[i][j], group: 'files', title: "Popup!"});
                    numNode = numNode + 1;
                }
            }
        }
        //find position of parent Directory
        for(let i = 0; i < string.length; i++)
        {
            //Index of folder to stop at
            for(let j = 0; j < string[i].length; j++)
            {
                if(string[i][j] === firstNode)
                {
                    indexOfDir = j;
                }
            }
        }


        //connect all subdirectories
        for(let i = 0; i < string.length; i++)
        {
            for(let j = indexOfDir; j < string[i].length-1; j++)
            {
                //console.log(string[i][j] + ' -> ' + string[i][j+1]);
                subEdges.push({from: string[i][j], to: string[i][j+1]});
                
            }
            
        }

        //Delete duplicates from subEdges;
        const filteredEdges = subEdges.filter(el => {
            const duplicate1 = tempSub.has(el.to);
        
            tempSub.add(el.to);
            return !duplicate1;
        })


        for(let i = 0; i < filteredEdges.length; i++)
        {
            nodes.forEach(node => 
                {
                    if(node.label === filteredEdges[i].from)
                    {   
                        fromID = node.id;
                    }
                    if(node.label === filteredEdges[i].to)
                    {
                        toID = node.id;
                    }
                });
                edges.add({from: fromID, to: toID});
        
        }
    
  
    
}
function changeDirectory()
{
    
    dialog.showOpenDialog({properties: ['openDirectory']},(dirPaths) => {
        
        console.log(dirPaths[0] + ' selected');
        directory = dirPaths[0];
        
        createVerticesAndEdges(directory, filePaths, subEdges, string, tempArr, tempSub, nodes, edges);
    })
    
}
function deleteFile(nodeLabel, nodeGroup)
{
    if(nodeGroup == 'files')
    {
        for(let i = 0; i < filePaths.length; i++)
        {
            if(filePaths[i].includes(nodeLabel))
            {
                try 
                {
                    fs.unlinkSync(filePaths[i]);
                    console.log("File deleted: " + filePaths[i]);
                    return;
                }
                catch (err)
                {
                    console.log(err);
                }
            }
        }
    }
}
