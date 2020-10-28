//Set options for network
var options = {
    autoResize: true,
    layout: 
    {
        randomSeed: 1,
        improvedLayout:false,
        hierarchical: 
        {
            enabled:false,
            levelSeparation: 150,
            nodeSpacing: 100,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD',        // UD, DU, LR, RL
            sortMethod: 'directed'   // hubsize, directed
        }
    },
   
    groups:
    {
        files: 
        {
            shape: 'image',
            icon: 
            {
                face: 'FontAwesome',
                code: '\uf316',
                size: 50,  //50,
                color:'black'
            },
            image: 'files.png'
        },
        folders:
        {
            shape: 'image',
            icon: 
            {
                face: 'FontAwesome',
                code: '\uf07c',
                size: 50,  //50,
                color:'red'
            },
            image: 'folders.png'
        }
    },
    edges:
    {
        //physics: true
    },
    
            
}

// create a network
var container = document.getElementById('mynetwork');


// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges,
};

// initialize your network!
var network = new vis.Network(container, data, options); 


// if we click on a node, we want to open it up!
network.on("selectNode", function (params) 
{
    if (params.nodes.length == 1) 
    {
        if (network.isCluster(params.nodes[0]) == true) 
        {
            var openClusterObj = {};
            openClusterObj.releaseFunction = function(clusterPosition, containedNodesPositions) 
            {
                return containedNodesPositions;
			}

            network.openCluster(params.nodes[0], openClusterObj);
        }
    }
});
//clusterByHubsize();
function clusterByHubsize() {
    network.setData(data);
    var clusterOptionsByData = {
        processProperties: function(clusterOptions, childNodes) {
          clusterOptions.label = "[" + childNodes.length + "]";
          return clusterOptions;
        },
        clusterNodeProperties: {borderWidth:3, shape:'box', font:{size:30}}
    };
    network.clusterByHubsize(undefined, clusterOptionsByData);
}

function changeNetwork()
{    
    changeDirectory();
}
network.on("doubleClick", function (params) {
    params.event = "[original event]";
    let object = JSON.stringify(params, null, 4);

    let parsedObject = JSON.parse(object);
    
    
    nodes.forEach(node => 
    { 
        if(node.id == parsedObject.nodes)
        {   
            console.log('Node: ' + node.label);
            if(node.group == 'files')
            {
                deleteFile(node.label, node.group);
                window.location.reload();
            }
            if(node.group == 'folders')
            {
                createAddWindow();
            }          
           

        }
    });
});

//Put about stuff here 
network.on("showPopup", function (params) {
    
    let object = JSON.stringify(params, null, 4);
    nodes.forEach(node => 
    { 
        if(node.id == object)
        {   
            console.log('Node: ' + node.label);     
        }
    });
    //document.getElementById('eventSpan').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
    //console.log(object);
});




