// Sample data for the advertising campaign planner
const mindMapData = {
  root: {
    id: 'root',
    label: 'Campaign Brief',
    details: 'This is the starting point for your advertising campaign planning. Choose a direction to explore.',
    options: [
      {
        id: 'option1',
        text: 'Target Audience Analysis',
        nextNode: 'audience'
      },
      {
        id: 'option2',
        text: 'Campaign Objectives',
        nextNode: 'objectives'
      },
      {
        id: 'option3',
        text: 'Creative Strategy',
        nextNode: 'creative'
      }
    ]
  },
  audience: {
    id: 'audience',
    label: 'Target Audience Analysis',
    details: 'Define and analyze your target audience to ensure your campaign resonates with the right people.',
    options: [
      {
        id: 'audience1',
        text: 'Demographics',
        nextNode: 'demographics'
      },
      {
        id: 'audience2',
        text: 'Psychographics',
        nextNode: 'psychographics'
      },
      {
        id: 'audience3',
        text: 'Behavioral Analysis',
        nextNode: 'behavior'
      }
    ]
  },
  objectives: {
    id: 'objectives',
    label: 'Campaign Objectives',
    details: 'Define clear, measurable objectives for your advertising campaign.',
    options: [
      {
        id: 'obj1',
        text: 'Awareness Goals',
        nextNode: 'awareness'
      },
      {
        id: 'obj2',
        text: 'Conversion Goals',
        nextNode: 'conversion'
      },
      {
        id: 'obj3',
        text: 'Brand Positioning',
        nextNode: 'positioning'
      }
    ]
  },
  creative: {
    id: 'creative',
    label: 'Creative Strategy',
    details: 'Develop the creative approach and messaging for your advertising campaign.',
    options: [
      {
        id: 'creative1',
        text: 'Key Messaging',
        nextNode: 'messaging'
      },
      {
        id: 'creative2',
        text: 'Visual Identity',
        nextNode: 'visual'
      },
      {
        id: 'creative3',
        text: 'Content Strategy',
        nextNode: 'content'
      }
    ]
  },
  demographics: {
    id: 'demographics',
    label: 'Demographics Analysis',
    details: 'Analyze age, gender, income, education, and other demographic factors of your target audience.',
    options: []
  },
  psychographics: {
    id: 'psychographics',
    label: 'Psychographic Profiling',
    details: 'Understand values, interests, lifestyles, and attitudes of your target audience.',
    options: []
  },
  behavior: {
    id: 'behavior',
    label: 'Behavioral Analysis',
    details: 'Study online behavior, purchase patterns, media consumption habits, and other behavioral traits of your audience.',
    options: []
  },
  awareness: {
    id: 'awareness',
    label: 'Awareness Goals',
    details: 'Define objectives related to brand awareness, reach, and visibility among your target audience.',
    options: []
  },
  conversion: {
    id: 'conversion',
    label: 'Conversion Goals',
    details: 'Set specific, measurable conversion objectives such as leads, sales, sign-ups, or other actions.',
    options: []
  },
  positioning: {
    id: 'positioning',
    label: 'Brand Positioning',
    details: 'Define how you want your brand to be perceived in relation to competitors and in the minds of consumers.',
    options: []
  },
  messaging: {
    id: 'messaging',
    label: 'Key Messaging',
    details: 'Develop the core messages, value proposition, and tone of voice for your campaign.',
    options: []
  },
  visual: {
    id: 'visual',
    label: 'Visual Identity',
    details: 'Create the visual elements of your campaign including imagery, color schemes, and design direction.',
    options: []
  },
  content: {
    id: 'content',
    label: 'Content Strategy',
    details: 'Plan what content to create, which formats to use, and how to distribute it across channels.',
    options: []
  }
};

// Create Vue app
const app = Vue.createApp({
  data() {
    return {
      graph: null,
      paper: null,
      showContextMenu: false,
      contextMenuStyle: {
        top: '0px',
        left: '0px'
      },
      contextMenuCell: null,
      showNodeDetails: false,
      nodeDetailsStyle: {
        top: '0px',
        left: '0px'
      },
      selectedNode: {
        id: null,
        label: '',
        details: '',
        options: []
      },
      showEditDialog: false,
      editingNode: {
        id: null,
        label: '',
        details: '',
        options: []
      },
      // 用户路径追踪
      userPath: [],
      // AI生成状态
      isGenerating: false,
      // 显示AI生成按钮
      showAIGenerateButton: false,
      // 显示AI生成的选项
      showAIOptions: false,
      // 显示AI生成提示词输入
      showAIGeneratePrompt: false,
      // AI生成的选项
      aiGeneratedOptions: [],
      // 用户输入的提示词
      userPrompt: '',
      // 当前选中的思考类型
      selectedThinkingType: null,
      // 显示路径分析
      showPathAnalysis: false,
      // 路径分析内容
      pathAnalysis: {
        summary: '',
        insights: [],
        recommendations: []
      },
      // Saved campaign paths
      savedPaths: [],
      // Show save campaign dialog
      showSavePathDialog: false,
      // Show load campaign dialog
      showLoadPathDialog: false,
      // New campaign name
      newPathName: '',
      // Current comparison campaign
      comparisonPath: null,
      // Show campaign comparison
      showPathComparison: false,
      // Show campaign comparison dialog
      showPathComparisonDialog: false,
      // Campaign comparison results
      pathComparisonResult: null,
      // Show share dialog
      showShareDialog: false,
      // Share link
      shareLink: '',
      // Share comment
      shareComment: '',
      // Show comments dialog
      showCommentsDialog: false,
      // Comments list
      comments: [],
      // New comment
      newComment: '',
      // Node feedback
      nodeRating: '',
      // Node feedback history
      nodeRatings: {},
      // Text-to-image feature
      showImageGenDialog: false,
      // Generated image
      generatedImage: null,
      // Positive prompt
      positivePrompt: '',
      // Negative prompt
      negativePrompt: '',
      // Image generation in progress
      isGeneratingImage: false,
      // Show generated image
      showGeneratedImage: false,
      // Generated images list
      generatedImages: [],
      // Currently viewing image
      currentViewingImage: null,
      // Show enlarged image
      showEnlargedImage: false,
      // Initial interface mode
      initialMode: true,
      // User initial input
      userInitialInput: '',
      // Processing user input
      processingInput: false
    };
  },
  mounted() {
    this.initMindMap();
    this.loadNodeRatings();
    this.loadGeneratedImages();

    // Add debug information
    console.log('Application loaded, image count:', this.generatedImages.length);

    // Periodically check thumbnails container status
    setTimeout(() => {
      const thumbnailsContainer = document.getElementById('thumbnails-container');
      if (thumbnailsContainer) {
        console.log('Thumbnails container status:', {
          display: thumbnailsContainer.style.display,
          visibility: thumbnailsContainer.style.visibility,
          height: thumbnailsContainer.offsetHeight,
          hasImages: this.generatedImages.length > 0
        });

        // Force display thumbnails container
        thumbnailsContainer.style.display = 'block';

        // If there are images, ensure thumbnails display correctly
        if (this.generatedImages.length > 0) {
          // Add test image to thumbnails container
          const scrollContainer = thumbnailsContainer.querySelector('.thumbnails-scroll');
          if (scrollContainer && scrollContainer.children.length === 0) {
            console.log('Adding test image to thumbnails container');

            // Ensure Vue rendering is complete
            this.$nextTick(() => {
              // Force display thumbnails container
              thumbnailsContainer.style.display = 'block';
              thumbnailsContainer.style.visibility = 'visible';
              thumbnailsContainer.style.opacity = '1';
            });
          }
        }
      } else {
        console.log('Thumbnails container not found');
      }
    }, 1000);
  },
  computed: {
    // Check if there are selected options
    hasSelectedOptions() {
      return this.aiGeneratedOptions.some(option => option.selected);
    }
  },
  methods: {
    // Initialize the mind map
    initMindMap() {
      // If in initial mode, don't initialize the chart
      if (this.initialMode) {
        return;
      }

      // Initialize the chart in non-initial mode
      try {
        // Get the container element
        const container = this.$el.querySelector('.mindmap-container');
        if (!container) {
          console.error('Mindmap container not found');
          return;
        }

        // Ensure container has proper dimensions
        container.style.width = '100%';
        container.style.height = '100%';

        // Create graph and paper
        this.graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({
          el: container,
          model: this.graph,
          // Use standard element view
          elementView: joint.dia.ElementView,
          width: '100%',
          height: '100%',
          gridSize: 10,
          drawGrid: true,
          background: {
            color: '#f8f9fa'
          },
          interactive: {
            elementMove: true,     // Allow element dragging
            linkMove: true,       // Allow link dragging
            vertexAdd: false,     // Don't allow adding vertices
            vertexMove: false,    // Don't allow moving vertices
            labelMove: false,     // Don't allow moving labels
            arrowheadMove: false, // Don't allow moving arrowheads
            useLinkTools: false   // Don't use link tools
          }
        });

        // Enable canvas panning
        this.enablePanning();

        // Create the initial tree structure
        const rootNode = this.createNodeShape('root', mindMapData.root.label, 400, 50, 0);
        rootNode.set('level', 0); // Set root node level to 0
        this.graph.addCell(rootNode);

        // Add first level children
        const firstLevelNodes = mindMapData.root.options.map((option, index) => {
          const node = this.createNodeShape(
            option.nextNode,
            mindMapData[option.nextNode].label,
            200 + index * 300,
            180,
            1 // Level 1 for first-level nodes
          );
          node.set('level', 1); // Set node level
          const link = this.createLink('root', option.nextNode);
          return [node, link];
        }).flat();

        this.graph.addCells(firstLevelNodes);

        // Select root node and show details
        this.selectedNode.id = 'root';
        this.selectedNode.label = mindMapData.root.label;
        this.selectedNode.details = mindMapData.root.details;
        this.selectedNode.options = mindMapData.root.options;
        this.showNodeDetails = true;

        // Set node details panel position
        const rootElement = this.graph.getCell('root');
        if (rootElement) {
          const position = rootElement.position();
          this.nodeDetailsStyle.top = `${position.y + 80}px`;
          this.nodeDetailsStyle.left = `${position.x + 80}px`;
        }

        // Show AI generate button
        this.showAIGenerateButton = true;

        // Set up event listeners
        this.setupEventListeners();
      } catch (error) {
        console.error('Error initializing mind map:', error);
      }
    },

    // Create a node shape
    createNodeShape(id, label, x, y, level = 0) {
      // Adjust font size based on text length
      let fontSize = 14;
      if (label.length > 20) {
        fontSize = 12;
      }
      if (label.length > 30) {
        fontSize = 10;
      }

      // Limit text length
      let displayLabel = label;
      if (label.length > 40) {
        displayLabel = label.substring(0, 37) + '...';
      }

      // Choose different colors based on level
      let fillColor = '#3498db';
      let strokeColor = '#2980b9';

      switch (level % 5) {
        case 0:
          fillColor = '#3498db'; // Blue
          strokeColor = '#2980b9';
          break;
        case 1:
          fillColor = '#2ecc71'; // Green
          strokeColor = '#27ae60';
          break;
        case 2:
          fillColor = '#9b59b6'; // Purple
          strokeColor = '#8e44ad';
          break;
        case 3:
          fillColor = '#e67e22'; // Orange
          strokeColor = '#d35400';
          break;
        case 4:
          fillColor = '#34495e'; // Dark blue
          strokeColor = '#2c3e50';
          break;
      }

      return new joint.shapes.standard.Rectangle({
        id: id,
        position: { x, y },
        size: { width: 160, height: 60 },
        attrs: {
          body: {
            fill: fillColor,
            stroke: strokeColor,
            rx: 10,
            ry: 10
          },
          label: {
            text: displayLabel,
            fill: 'white',
            fontSize: fontSize,
            fontWeight: 'bold',
            textWrap: {
              width: 150,
              height: 50,
              ellipsis: true
            }
          }
        }
      });
    },

    // Create a link between nodes
    createLink(sourceId, targetId) {
      return new joint.shapes.standard.Link({
        source: { id: sourceId },
        target: { id: targetId },
        attrs: {
          line: {
            stroke: '#2980b9',
            strokeWidth: 2,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 Z'
            }
          }
        },
        router: { name: 'manhattan' },
        connector: { name: 'rounded' }
      });
    },

    // Set up event listeners for the paper
    setupEventListeners() {
      // Ensure chart is initialized
      if (!this.paper) {
        console.error('Paper not initialized');
        return;
      }

      // Cell click event
      this.paper.on('cell:pointerclick', (cellView) => {
        const cell = cellView.model;
        if (cell.isElement()) {
          const nodeId = cell.id;
          const nodeData = mindMapData[nodeId];

          if (nodeData) {
            // Check if it's an image node
            const isImageNode = nodeId.startsWith('image_node_') || nodeData.imageUrl;

            if (isImageNode) {
              console.log('Clicked image node:', nodeId);

              // If it's an image node, show enlarged image
              const imageUrl = nodeData.imageUrl || cell.prop('imageUrl');
              if (imageUrl) {
                console.log('Image URL:', imageUrl);

                // Check if image is available
                window.customJointUtils.checkImageLoaded(imageUrl, (isLoaded) => {
                  if (isLoaded) {
                    console.log('Image loaded successfully, showing enlarged image');

                    // Create a temporary image object for viewing
                    const tempImage = {
                      id: nodeId,
                      url: imageUrl,
                      timestamp: nodeData.timestamp || new Date().toISOString(),
                      positivePrompt: nodeData.details ? nodeData.details.split('\n\n')[1]?.replace('Positive Prompt: ', '') : '',
                      negativePrompt: nodeData.details ? nodeData.details.split('\n\n')[2]?.replace('Negative Prompt: ', '') : ''
                    };

                    this.currentViewingImage = tempImage;
                    this.showEnlargedImage = true;
                  } else {
                    console.error('Image loading failed:', imageUrl);
                    alert('Image loading failed, please try generating again');
                  }
                });
                return;
              }
            }

            // If not an image node, process normally
            // Update selected node data
            this.selectedNode.id = nodeId;
            this.selectedNode.label = nodeData.label;
            this.selectedNode.details = nodeData.details;
            this.selectedNode.options = nodeData.options;

            // Show node details panel
            this.showNodeDetails = true;

            // Show AI generate button, all nodes can generate AI options
            this.showAIGenerateButton = true;

            // No longer need to adjust details panel position based on node position, as it's now fixed
          }
        }
      });

      // Background click to hide panels
      this.paper.on('blank:pointerclick', () => {
        this.showNodeDetails = false;
        this.showContextMenu = false;
      });

      // Right-click context menu
      this.paper.on('cell:contextmenu', (cellView, evt) => {
        evt.preventDefault();

        // Store the cell for context menu actions
        this.contextMenuCell = cellView.model;

        // Show context menu at mouse position
        this.showContextMenu = true;
        this.contextMenuStyle.top = `${evt.clientY}px`;
        this.contextMenuStyle.left = `${evt.clientX}px`;
      });
    },

    // Add a child node from the context menu
    addChildNode() {
      if (!this.contextMenuCell || !this.contextMenuCell.isElement()) return;

      const parentId = this.contextMenuCell.id;
      const parentNode = mindMapData[parentId];

      if (!parentNode) return;

      // Create a new node ID
      const newNodeId = `node_${Date.now()}`;

      // Add to data model
      mindMapData[newNodeId] = {
        id: newNodeId,
        label: 'New Element',
        details: 'Add details for this new campaign element',
        options: []
      };

      // Add option to parent
      if (!parentNode.options) {
        parentNode.options = [];
      }

      parentNode.options.push({
        id: `option_${Date.now()}`,
        text: 'Explore',
        nextNode: newNodeId
      });

      // Get parent position
      const parentPosition = this.contextMenuCell.position();

      // Calculate new position (below parent, offset to the right)
      const childCount = parentNode.options.length;
      const xOffset = (childCount - 1) * 180 - 90;

      // Create and add the new node
      const newNode = this.createNodeShape(
        newNodeId,
        'New Element',
        parentPosition.x + xOffset,
        parentPosition.y + 150
      );

      const link = this.createLink(parentId, newNodeId);
      this.graph.addCells([newNode, link]);

      // Hide context menu
      this.showContextMenu = false;
    },

    // Delete a node from the context menu
    deleteNode() {
      if (!this.contextMenuCell || !this.contextMenuCell.isElement()) return;

      const nodeId = this.contextMenuCell.id;

      // Don't allow deleting the root node
      if (nodeId === 'root') return;

      // Remove from graph
      this.graph.removeCells(this.contextMenuCell);

      // Remove from data model
      delete mindMapData[nodeId];

      // Remove references from parent nodes
      Object.values(mindMapData).forEach(node => {
        if (node.options) {
          node.options = node.options.filter(option => option.nextNode !== nodeId);
        }
      });

      // Hide context menu and details panel
      this.showContextMenu = false;
      this.showNodeDetails = false;
    },

    // Reset the view from the context menu
    resetView() {
      this.paper.scale(1, 1);
      this.paper.translate(0, 0);
      this.showContextMenu = false;
    },

    // Select an option from the node details panel
    selectOption(option) {
      const nextNodeId = option.nextNode;
      const nextNode = mindMapData[nextNodeId];

      if (nextNode) {
        // Find the element in the graph
        const element = this.graph.getCell(nextNodeId);

        if (element) {
          // Center the view on the selected node
          this.paper.translate(
            this.paper.el.clientWidth / 2 - element.position().x - element.size().width / 2,
            this.paper.el.clientHeight / 2 - element.position().y - element.size().height / 2
          );

          // Record user's selected path
          const currentNode = mindMapData[this.selectedNode.id];
          this.userPath.push({
            fromNodeId: this.selectedNode.id,
            fromNodeLabel: currentNode.label,
            optionId: option.id,
            optionText: option.text,
            toNodeId: nextNodeId,
            toNodeLabel: nextNode.label,
            timestamp: new Date().toISOString()
          });

          // Highlight path
          this.highlightPath();

          // Update selected node
          this.selectedNode.id = nextNodeId;
          this.selectedNode.label = nextNode.label;
          this.selectedNode.details = nextNode.details;
          this.selectedNode.options = nextNode.options;

          // Update details panel position
          const position = element.position();
          this.nodeDetailsStyle.top = `${position.y + 80}px`;
          this.nodeDetailsStyle.left = `${position.x + 80}px`;

          // If node has no options, show AI generate button
          if (nextNode.options.length === 0) {
            this.showAIGenerateButton = true;
          } else {
            this.showAIGenerateButton = false;
          }
        }
      }
    },

    // Highlight user's selected path
    highlightPath() {
      // Reset all link styles
      this.graph.getLinks().forEach(link => {
        link.attr({
          line: {
            stroke: '#2980b9',
            strokeWidth: 2
          }
        });
      });

      // Highlight user path
      if (this.userPath.length > 0) {
        this.userPath.forEach(step => {
          const links = this.graph.getLinks().filter(link =>
            link.get('source').id === step.fromNodeId &&
            link.get('target').id === step.toNodeId
          );

          links.forEach(link => {
            link.attr({
              line: {
                stroke: '#e74c3c',
                strokeWidth: 3
              }
            });
          });
        });
      }
    },

    // Edit node from context menu
    editNode() {
      if (!this.contextMenuCell || !this.contextMenuCell.isElement()) return;

      const nodeId = this.contextMenuCell.id;
      const nodeData = mindMapData[nodeId];

      if (!nodeData) return;

      // Set up editing node data
      this.editingNode.id = nodeId;
      this.editingNode.label = nodeData.label;
      this.editingNode.details = nodeData.details;

      // Clone options to avoid direct reference
      this.editingNode.options = nodeData.options ? JSON.parse(JSON.stringify(nodeData.options)) : [];

      // Show edit dialog
      this.showEditDialog = true;

      // Hide context menu
      this.showContextMenu = false;
    },

    // Add a new option to the editing node
    addOption() {
      // Generate a unique ID for the new option
      const optionId = `option_${Date.now()}`;

      // Create a new node ID for the option's target
      const newNodeId = `node_${Date.now()}`;

      // Add the option
      this.editingNode.options.push({
        id: optionId,
        text: 'New Path',
        nextNode: newNodeId
      });
    },

    // Remove an option from the editing node
    removeOption(index) {
      this.editingNode.options.splice(index, 1);
    },

    // Save node edit
    saveNodeEdit() {
      const nodeId = this.editingNode.id;
      const nodeData = mindMapData[nodeId];

      if (!nodeData) return;

      // Update data model
      nodeData.label = this.editingNode.label;
      nodeData.details = this.editingNode.details;

      // Process options
      const newOptions = this.editingNode.options;

      // Update options in the data model
      nodeData.options = JSON.parse(JSON.stringify(newOptions));

      // Create new nodes for new options
      newOptions.forEach(option => {
        const targetNodeId = option.nextNode;

        // Check if this is a new node that needs to be created
        if (!mindMapData[targetNodeId] && !this.graph.getCell(targetNodeId)) {
          // Create the new node in the data model
          mindMapData[targetNodeId] = {
            id: targetNodeId,
            label: 'New Element',
            details: 'Add details for this new campaign element',
            options: []
          };

          // Calculate position for the new node
          const parentElement = this.graph.getCell(nodeId);
          if (parentElement) {
            const parentPosition = parentElement.position();
            const childCount = nodeData.options.length;
            const index = nodeData.options.findIndex(opt => opt.id === option.id);
            const xOffset = (index - childCount / 2) * 180;

            // Create and add the new node to the graph
            const newNode = this.createNodeShape(
              targetNodeId,
              'New Element',
              parentPosition.x + xOffset,
              parentPosition.y + 150
            );

            const link = this.createLink(nodeId, targetNodeId);
            this.graph.addCells([newNode, link]);
          }
        }
      });

      // Update graph
      const element = this.graph.getCell(nodeId);
      if (element) {
        element.attr('label/text', nodeData.label);
      }

      // Update selected node if it's the same node
      if (this.selectedNode.id === nodeId) {
        this.selectedNode.label = nodeData.label;
        this.selectedNode.details = nodeData.details;
        this.selectedNode.options = JSON.parse(JSON.stringify(nodeData.options));
      }

      // Hide edit dialog
      this.showEditDialog = false;
    },

    // Cancel node edit
    cancelNodeEdit() {
      this.showEditDialog = false;
    },

    // Show AI generate options dialog
    showAIGenerateDialog() {
      this.showAIOptions = false;
      this.aiGeneratedOptions = [];
      this.userPrompt = '';
      this.showAIGeneratePrompt = true;
    },

    // Generate AI options
    generateAIOptions() {
      if (!this.userPrompt.trim()) {
        alert('Please enter a prompt to generate options');
        return;
      }

      this.isGenerating = true;

      // Simulate AI generation process
      setTimeout(() => {
        // This simulates AI-generated options
        // In a real application, this would call a backend API
        const currentContext = {
          currentNode: this.selectedNode,
          userPath: this.userPath,
          prompt: this.userPrompt
        };

        this.aiGeneratedOptions = this.simulateAIGeneration(currentContext);
        this.isGenerating = false;
        this.showAIOptions = true;
        this.showAIGeneratePrompt = false;
      }, 1500);
    },

    // Simulate AI option generation
    simulateAIGeneration(context) {
      // Generate relevant options based on current node and user path
      const options = [];
      const themes = [
        'In-depth Analysis', 'Critical Thinking', 'Creative Solutions',
        'Systems Thinking', 'Impact Assessment', 'Alternative Approaches',
        'Multiple Perspectives', 'Identifying Biases', 'Root Cause Analysis'
      ];

      // Generate 3-5 options
      const numOptions = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < numOptions; i++) {
        const theme = themes[Math.floor(Math.random() * themes.length)];
        let optionText = '';

        // Generate different options based on user prompt
        if (context.prompt.includes('problem') || context.prompt.includes('issue')) {
          optionText = `${theme} of different aspects of this problem`;
        } else if (context.prompt.includes('solution') || context.prompt.includes('resolve')) {
          optionText = `${theme} of possible solutions`;
        } else if (context.prompt.includes('think') || context.prompt.includes('consider')) {
          optionText = `${theme} of the thinking process for this issue`;
        } else {
          optionText = `${theme} of various aspects of ${context.prompt}`;
        }

        options.push({
          id: `ai_option_${Date.now()}_${i}`,
          text: optionText,
          details: `This option will guide you through content related to ${theme}, exploring different angles of ${context.prompt}.`,
          selected: false // Add selection state
        });
      }

      return options;
    },

    // Toggle option selection state
    toggleOptionSelection(option) {
      // Toggle selection state
      option.selected = !option.selected;
    },

    // Apply selected options
    applySelectedOptions() {
      // Get all selected options
      const selectedOptions = this.aiGeneratedOptions.filter(option => option.selected);

      if (selectedOptions.length === 0) {
        alert('Please select at least one option');
        return;
      }

      // Current node ID
      const currentNodeId = this.selectedNode.id;
      const currentNode = mindMapData[currentNodeId];

      if (!currentNode.options) {
        currentNode.options = [];
      }

      // Record new nodes and links
      const newCells = [];

      // Process each selected option
      selectedOptions.forEach((option, index) => {
        // Create new node
        const newNodeId = `node_${Date.now()}_${index}`;

        // Add to data model
        mindMapData[newNodeId] = {
          id: newNodeId,
          label: option.text,
          details: option.details,
          options: []
        };

        // Add option to current node
        const newOption = {
          id: `option_${Date.now()}_${index}`,
          text: option.text,
          nextNode: newNodeId
        };

        currentNode.options.push(newOption);

        // Create new node in the graph
        const parentElement = this.graph.getCell(currentNodeId);
        if (parentElement) {
          const parentPosition = parentElement.position();
          const childCount = currentNode.options.length;
          const optionIndex = currentNode.options.length - 1;
          const xOffset = (optionIndex - childCount / 2) * 180;

          // Get current node level
          const parentLevel = parentElement.get('level') || 0;
          const nodeLevel = parentLevel + 1;

          // Create new node with level
          const newNode = this.createNodeShape(
            newNodeId,
            option.text,
            parentPosition.x + xOffset,
            parentPosition.y + 150,
            nodeLevel
          );

          // Store level information
          newNode.set('level', nodeLevel);

          // Create link
          const link = this.createLink(currentNodeId, newNodeId);

          // Add to new cells list
          newCells.push(newNode, link);
        }
      });

      // Add all new cells at once
      if (newCells.length > 0) {
        this.graph.addCells(newCells);
      }

      // Update current node options
      this.selectedNode.options = currentNode.options;

      // Hide AI options dialog
      this.showAIOptions = false;
      this.showAIGenerateButton = false;
    },

    // Select a single AI-generated option (for backward compatibility)
    selectAIOption(option) {
      // Select this option
      option.selected = true;

      // Deselect other options
      this.aiGeneratedOptions.forEach(opt => {
        if (opt !== option) {
          opt.selected = false;
        }
      });

      // Apply selected options
      this.applySelectedOptions();
    },

    // Select thinking type
    selectThinkingType(type) {
      // If this type is already selected, deselect it
      if (this.selectedThinkingType === type) {
        this.selectedThinkingType = null;
      } else {
        this.selectedThinkingType = type;
      }

      // Generate prompt based on selected thinking type
      let prompt = '';

      switch (type) {
        case 'Root Cause':
          prompt = `Explore the root causes and underlying factors of "${this.selectedNode.label}"`;
          break;
        case 'System Impact':
          prompt = `Analyze the systemic impacts and chain effects of "${this.selectedNode.label}"`;
          break;
        case 'Potential Opportunities':
          prompt = `Discover potential opportunities and possible breakthroughs in "${this.selectedNode.label}"`;
          break;
        default:
          return;
      }

      // Set prompt and show AI generate dialog
      this.userPrompt = prompt;
      this.showAIGeneratePrompt = true;
    },

    // Cancel AI generation
    cancelAIGenerate() {
      this.showAIOptions = false;
      this.showAIGeneratePrompt = false;
    },

    // Generate path analysis
    generatePathAnalysis() {
      if (this.userPath.length === 0) {
        alert('Not enough path data for analysis');
        return;
      }

      this.isGenerating = true;

      // Simulate analysis generation
      setTimeout(() => {
        this.pathAnalysis = this.simulatePathAnalysis();
        this.isGenerating = false;
        this.showPathAnalysis = true;
      }, 1500);
    },

    // Simulate path analysis
    simulatePathAnalysis() {
      // Generate analysis based on user path
      const nodeNames = this.userPath.map(step => step.toNodeLabel);
      const startNode = this.userPath.length > 0 ? this.userPath[0].fromNodeLabel : 'Starting point';

      return {
        summary: `Your thinking path started from ${startNode}, and went through ${nodeNames.join(' → ')} nodes. This indicates you're focusing on ${nodeNames.length > 2 ? 'multiple aspects and depth' : 'basic aspects'} of the issue.`,
        insights: [
          `Your thinking path demonstrates a ${nodeNames.includes('Problem Analysis') ? 'analytical' : 'exploratory'} thinking pattern.`,
          `During your thinking process, you particularly focused on the ${nodeNames[Math.floor(nodeNames.length / 2)]} stage.`,
          `Your thinking path shows characteristics of ${this.userPath.length > 3 ? 'deep thinking' : 'broad exploration'}.`
        ],
        recommendations: [
          `We suggest you further explore content related to ${nodeNames[nodeNames.length - 1]}.`,
          `Consider comparing ${startNode} and ${nodeNames[nodeNames.length - 1]}.`,
          `Try thinking about this issue from different angles, such as analyzing from the opposite perspective.`
        ]
      };
    },

    // Close path analysis
    closePathAnalysis() {
      this.showPathAnalysis = false;
    },

    // Show save path dialog
    showSavePath() {
      this.newPathName = `Campaign ${this.savedPaths.length + 1}`;
      this.showSavePathDialog = true;
    },

    // Save current thinking path
    saveCurrentPath() {
      if (!this.newPathName.trim()) {
        alert('Please enter a path name');
        return;
      }

      if (this.userPath.length === 0) {
        alert('No campaign path to save');
        return;
      }

      // Create path object
      const pathToSave = {
        id: `path_${Date.now()}`,
        name: this.newPathName,
        path: JSON.parse(JSON.stringify(this.userPath)),
        timestamp: new Date().toISOString(),
        nodes: this.userPath.map(step => {
          return {
            id: step.toNodeId,
            label: step.toNodeLabel
          };
        })
      };

      // Add to saved paths
      this.savedPaths.push(pathToSave);

      // Try to save to local storage
      try {
        localStorage.setItem('savedPaths', JSON.stringify(this.savedPaths));
      } catch (e) {
        console.error('Failed to save paths to localStorage:', e);
      }

      this.showSavePathDialog = false;
      alert(`Campaign "${this.newPathName}" has been saved successfully!`);
    },

    // Cancel save path
    cancelSavePath() {
      this.showSavePathDialog = false;
    },

    // Show load path dialog
    showLoadPath() {
      // Try to load paths from local storage
      try {
        const savedPathsStr = localStorage.getItem('savedPaths');
        if (savedPathsStr) {
          this.savedPaths = JSON.parse(savedPathsStr);
        }
      } catch (e) {
        console.error('Failed to load paths from localStorage:', e);
      }

      this.showLoadPathDialog = true;
    },

    // Load selected path
    loadSelectedPath(path) {
      // Clear current path
      this.userPath = [];

      // Reset graph
      this.resetView();

      // Load saved path
      this.userPath = JSON.parse(JSON.stringify(path.path));

      // Highlight path
      this.highlightPath();

      // If there are nodes, select the last one
      if (this.userPath.length > 0) {
        const lastStep = this.userPath[this.userPath.length - 1];
        const lastNodeId = lastStep.toNodeId;
        const lastNode = mindMapData[lastNodeId];

        if (lastNode) {
          // Select node
          this.selectedNode.id = lastNodeId;
          this.selectedNode.label = lastNode.label;
          this.selectedNode.details = lastNode.details;
          this.selectedNode.options = lastNode.options;
          this.showNodeDetails = true;

          // Update node details panel position
          const element = this.graph.getCell(lastNodeId);
          if (element) {
            const position = element.position();
            this.nodeDetailsStyle.top = `${position.y + 80}px`;
            this.nodeDetailsStyle.left = `${position.x + 80}px`;

            // Center view on this node
            this.paper.translate(
              this.paper.el.clientWidth / 2 - position.x - element.size().width / 2,
              this.paper.el.clientHeight / 2 - position.y - element.size().height / 2
            );
          }

          // Show AI generate button for all nodes
          this.showAIGenerateButton = true;
        }
      }

      this.showLoadPathDialog = false;
      alert(`Campaign "${path.name}" has been loaded successfully!`);
    },

    // Delete saved path
    deleteSelectedPath(index) {
      if (confirm(`Are you sure you want to delete campaign "${this.savedPaths[index].name}"?`)) {
        this.savedPaths.splice(index, 1);

        // Update local storage
        try {
          localStorage.setItem('savedPaths', JSON.stringify(this.savedPaths));
        } catch (e) {
          console.error('Failed to update localStorage after deletion:', e);
        }
      }
    },

    // Cancel load path
    cancelLoadPath() {
      this.showLoadPathDialog = false;
    },

    // Export thinking path
    exportPath() {
      if (this.userPath.length === 0) {
        alert('No campaign path to export');
        return;
      }

      // Create data to export
      const exportData = {
        path: this.userPath,
        nodes: this.userPath.map(step => {
          return {
            id: step.toNodeId,
            label: step.toNodeLabel,
            details: mindMapData[step.toNodeId] ? mindMapData[step.toNodeId].details : ''
          };
        }),
        timestamp: new Date().toISOString(),
        metadata: {
          title: 'AI Advertising Campaign Planner - Exported Path',
          description: `Campaign path starts from ${this.userPath[0].fromNodeLabel}, going through ${this.userPath.length} nodes`
        }
      };

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `campaign-path-${new Date().toISOString().slice(0, 10)}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },

    // Import thinking path
    importPath() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = event => {
          try {
            const importedData = JSON.parse(event.target.result);

            // Validate imported data
            if (!importedData.path || !Array.isArray(importedData.path)) {
              throw new Error('Invalid path data format');
            }

            // Create path to save
            const pathToSave = {
              id: `path_${Date.now()}`,
              name: `Imported Campaign ${new Date().toLocaleString()}`,
              path: importedData.path,
              timestamp: new Date().toISOString(),
              nodes: importedData.nodes || importedData.path.map(step => ({
                id: step.toNodeId,
                label: step.toNodeLabel
              }))
            };

            // Add to saved paths
            this.savedPaths.push(pathToSave);

            // Update local storage
            try {
              localStorage.setItem('savedPaths', JSON.stringify(this.savedPaths));
            } catch (e) {
              console.error('Failed to save imported path to localStorage:', e);
            }

            alert(`Campaign successfully imported and saved as "${pathToSave.name}". You can open it from the Load Campaign menu.`);

          } catch (error) {
            alert(`Import failed: ${error.message}`);
            console.error('Import error:', error);
          }
        };

        reader.readAsText(file);
      };

      input.click();
    },

    // Show path comparison dialog
    showComparePathDialog() {
      if (this.userPath.length === 0) {
        alert('No current campaign path available for comparison');
        return;
      }

      // Try to load paths from local storage
      try {
        const savedPathsStr = localStorage.getItem('savedPaths');
        if (savedPathsStr) {
          this.savedPaths = JSON.parse(savedPathsStr);
        }
      } catch (e) {
        console.error('Failed to load paths from localStorage:', e);
      }

      if (this.savedPaths.length === 0) {
        alert('No saved campaigns available for comparison. Please save the current campaign or load another one first.');
        return;
      }

      this.showPathComparisonDialog = true;
    },

    // Compare with selected path
    compareWithPath(path) {
      this.comparisonPath = path;

      // Generate comparison analysis
      this.pathComparisonResult = this.generatePathComparison(this.userPath, path.path);

      this.showPathComparisonDialog = false;
      this.showPathComparison = true;
    },

    // Generate path comparison analysis
    generatePathComparison(currentPath, comparisonPath) {
      // Get path information
      const currentPathNodes = currentPath.map(step => step.toNodeLabel);
      const comparisonPathNodes = comparisonPath.map(step => step.toNodeLabel);

      // Find common nodes
      const commonNodes = currentPathNodes.filter(node => comparisonPathNodes.includes(node));

      // Find different nodes
      const uniqueCurrentNodes = currentPathNodes.filter(node => !comparisonPathNodes.includes(node));
      const uniqueComparisonNodes = comparisonPathNodes.filter(node => !currentPathNodes.includes(node));

      // Calculate path length difference
      const lengthDifference = Math.abs(currentPath.length - comparisonPath.length);

      // Calculate similarity
      const similarity = commonNodes.length / Math.max(currentPathNodes.length, comparisonPathNodes.length);

      // Generate comparison results
      return {
        currentPathName: 'Current Campaign',
        comparisonPathName: this.comparisonPath.name,
        currentPathLength: currentPath.length,
        comparisonPathLength: comparisonPath.length,
        commonNodes,
        uniqueCurrentNodes,
        uniqueComparisonNodes,
        lengthDifference,
        similarity: Math.round(similarity * 100),
        insights: [
          `The similarity between the two campaigns is ${Math.round(similarity * 100)}%, which indicates they are ${similarity > 0.7 ? 'very similar' : similarity > 0.4 ? 'somewhat similar' : 'quite different'}.`,
          `The two campaigns share ${commonNodes.length} common nodes, with ${uniqueCurrentNodes.length} and ${uniqueComparisonNodes.length} unique nodes respectively.`,
          `The current campaign has ${currentPath.length} nodes, while the comparison campaign has ${comparisonPath.length}, with a difference of ${lengthDifference} nodes.`
        ],
        recommendations: [
          uniqueComparisonNodes.length > 0 ? `Consider exploring the unique nodes in the comparison campaign: ${uniqueComparisonNodes.join(', ')}.` : 'There are no unique nodes to explore.',
          commonNodes.length > 0 ? `The common nodes between both campaigns may be key points: ${commonNodes.join(', ')}.` : 'There are no common nodes between the campaigns.',
          similarity < 0.3 ? 'The two campaigns are quite different. Try combining both approaches for a more comprehensive strategy.' : 'The two campaigns have many similarities. Try exploring more diverse angles.'
        ]
      };
    },

    // Close path comparison
    closePathComparison() {
      this.showPathComparison = false;
      this.comparisonPath = null;
    },

    // Cancel path comparison
    cancelPathComparison() {
      this.showPathComparisonDialog = false;
    },

    // Show share dialog
    showShare() {
      if (this.userPath.length === 0) {
        alert('No campaign path available to share');
        return;
      }

      // Generate share link
      // In a real application, this would send data to the backend to generate a real share link

      // In a real application, this would call a backend API to generate a real share link
      // Here we simulate a link
      const shareId = Math.random().toString(36).substring(2, 10);
      this.shareLink = `https://example.com/share/${shareId}`;

      this.shareComment = '';
      this.showShareDialog = true;
    },

    // Share path
    sharePath() {
      // In a real application, this would send share data to the backend
      alert(`Share link generated: ${this.shareLink}\n\nIn a real application, this link would allow others to view your campaign path.`);

      // Try to copy to clipboard
      try {
        navigator.clipboard.writeText(this.shareLink).then(() => {
          alert('Link copied to clipboard!');
        });
      } catch (e) {
        console.error('Failed to copy link:', e);
      }

      this.showShareDialog = false;
    },

    // Cancel share
    cancelShare() {
      this.showShareDialog = false;
    },

    // Show comments dialog
    showComments() {
      // Simulate loading comments
      this.loadComments();
      this.showCommentsDialog = true;
    },

    // Load comments
    loadComments() {
      // In a real application, this would load comments from the backend
      // Here we simulate some comments
      this.comments = [
        {
          id: 1,
          author: 'User A',
          text: 'This campaign path is very insightful, especially in the problem analysis section.',
          timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: 2,
          author: 'User B',
          text: 'I think we could go deeper on the "Identifying Potential Biases" aspect.',
          timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        }
      ];
    },

    // Add comment
    addComment() {
      if (!this.newComment.trim()) {
        alert('Please enter a comment');
        return;
      }

      // Create new comment
      const comment = {
        id: this.comments.length + 1,
        author: 'Current User', // In a real application, this would use the actual username
        text: this.newComment,
        timestamp: new Date().toISOString()
      };

      // Add to comments list
      this.comments.push(comment);

      // Clear input
      this.newComment = '';

      // In a real application, this would send the comment to the backend
    },

    // Close comments dialog
    closeComments() {
      this.showCommentsDialog = false;
    },

    // Format time
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },

    // Save node feedback
    saveNodeRating() {
      if (!this.nodeRating.trim()) {
        return;
      }

      const nodeId = this.selectedNode.id;
      if (!nodeId) return;

      // Initialize node feedback history
      if (!this.nodeRatings[nodeId]) {
        this.nodeRatings[nodeId] = [];
      }

      // Add new feedback
      this.nodeRatings[nodeId].push({
        id: Date.now(),
        text: this.nodeRating,
        timestamp: new Date().toISOString()
      });

      // Clear input
      this.nodeRating = '';

      // Try to save to local storage
      try {
        localStorage.setItem('nodeRatings', JSON.stringify(this.nodeRatings));
      } catch (e) {
        console.error('Failed to save node ratings to localStorage:', e);
      }
    },

    // Load node feedback
    loadNodeRatings() {
      try {
        const savedRatings = localStorage.getItem('nodeRatings');
        if (savedRatings) {
          this.nodeRatings = JSON.parse(savedRatings);
        }
      } catch (e) {
        console.error('Failed to load node ratings from localStorage:', e);
      }
    },

    // Show image generator dialog
    showImageGenerator() {
      // Generate prompts from selected node
      this.generatePromptsFromSelectedNode();

      this.showImageGenDialog = true;
    },

    // Generate prompts from selected node
    generatePromptsFromSelectedNode() {
      if (!this.selectedNode || !this.selectedNode.id) {
        this.positivePrompt = 'professional advertising campaign, high quality, commercial photography';
        this.negativePrompt = 'amateur, low quality, blurry, distorted';
        return;
      }

      const nodeId = this.selectedNode.id;
      const node = mindMapData[nodeId];

      if (!node) {
        this.positivePrompt = 'professional advertising campaign, high quality, commercial photography';
        this.negativePrompt = 'amateur, low quality, blurry, distorted';
        return;
      }

      // Use current node as positive prompt with advertising focus
      this.positivePrompt = `${node.label}, ${node.details.split('.')[0]}, professional advertising visual, high quality, commercial photography`;

      // Get all node IDs
      const allNodeIds = Object.keys(mindMapData);

      // Collect negative prompts (nodes that are not the current node)
      const negativeNodeIds = allNodeIds.filter(id => id !== nodeId && id !== 'root');
      const negativeKeywords = negativeNodeIds
        .map(id => mindMapData[id])
        .filter(n => n) // Filter out non-existent nodes
        .map(n => n.label);

      // Set negative prompt with advertising focus
      this.negativePrompt = `${negativeKeywords.join(', ')}, amateur, low quality, blurry, distorted, unprofessional`;
    },

    // Generate prompts
    generatePrompts() {
      // Get current path nodes
      const pathNodeIds = this.userPath.map(step => step.toNodeId);
      const pathNodes = pathNodeIds.map(id => mindMapData[id]);

      // Collect positive prompts
      const positiveKeywords = pathNodes
        .filter(node => node) // Filter out non-existent nodes
        .map(node => {
          // Use node label and details as keywords
          return `${node.label}, ${node.details.split('.')[0]}`;
        });

      // Get all node IDs
      const allNodeIds = Object.keys(mindMapData);

      // Collect negative prompts (nodes that are not in the path)
      const negativeNodeIds = allNodeIds.filter(id => !pathNodeIds.includes(id) && id !== 'root');
      const negativeKeywords = negativeNodeIds
        .map(id => mindMapData[id])
        .filter(node => node) // Filter out non-existent nodes
        .map(node => node.label);

      // Set prompts with advertising focus
      this.positivePrompt = `${positiveKeywords.join(', ')}, professional advertising visual, high quality, commercial photography`;
      this.negativePrompt = `${negativeKeywords.join(', ')}, amateur, low quality, blurry, distorted, unprofessional`;
    },

    // Generate image
    generateImage() {
      if (!this.positivePrompt.trim()) {
        alert('Please enter a positive prompt first');
        return;
      }

      this.isGeneratingImage = true;
      console.log('Starting image generation...');

      // Simulate image generation
      setTimeout(() => {
        // In a real application, this would call a text-to-image API
        // Here we use a random image to simulate the result
        const imageSize = 512;
        const randomId = Math.floor(Math.random() * 1000);
        const imageUrl = `https://picsum.photos/seed/${randomId}/${imageSize}`;
        console.log('Image URL generated:', imageUrl);

        // Make sure a node is selected
        if (!this.selectedNode || !this.selectedNode.id) {
          alert('Please select a node first');
          this.isGeneratingImage = false;
          return;
        }

        // Create new image object
        const newImage = {
          id: `img_${Date.now()}`,
          url: imageUrl,
          positivePrompt: this.positivePrompt,
          negativePrompt: this.negativePrompt,
          timestamp: new Date().toISOString(),
          pathNodeIds: [],  // No longer dependent on user path
          sourceNodeId: this.selectedNode.id // Add source node ID
        };
        console.log('New image object created:', newImage);

        // Add to image list
        this.generatedImages.unshift(newImage);
        this.generatedImage = imageUrl;
        console.log('Current image list length:', this.generatedImages.length);

        // Save to local storage
        try {
          localStorage.setItem('generatedImages', JSON.stringify(this.generatedImages));
          console.log('Image list saved to local storage');
        } catch (e) {
          console.error('Failed to save generated images to localStorage:', e);
        }

        // Check if image is available
        window.customJointUtils.checkImageLoaded(imageUrl, (isLoaded) => {
          if (isLoaded) {
            console.log('Image loaded successfully, adding to node');
            // Add image thumbnail node for current node
            this.addImageThumbnailNode(newImage);
          } else {
            console.error('Image loading failed:', imageUrl);
            alert('Image loading failed, please try generating again');
          }
        });

        // Force view update
        this.$nextTick(() => {
          // Ensure thumbnails container is visible
          const thumbnailsContainer = document.getElementById('thumbnails-container');
          if (thumbnailsContainer) {
            thumbnailsContainer.style.display = 'block';
            thumbnailsContainer.style.visibility = 'visible';
            thumbnailsContainer.style.opacity = '1';
            console.log('Thumbnails container set to visible');

            // Force update thumbnail content
            const scrollContainer = thumbnailsContainer.querySelector('.thumbnails-scroll');
            if (scrollContainer) {
              // Clear and re-add all images
              scrollContainer.innerHTML = '';

              // 手动创建缩略图元素
              this.generatedImages.forEach(image => {
                const thumbnailItem = document.createElement('div');
                thumbnailItem.className = 'thumbnail-item';
                thumbnailItem.onclick = () => this.viewThumbnail(image);

                const thumbnailImage = document.createElement('div');
                thumbnailImage.className = 'thumbnail-image';

                const img = document.createElement('img');
                img.src = image.url;
                img.alt = 'Ad visual ' + image.id;
                img.title = this.formatTime(image.timestamp);

                thumbnailImage.appendChild(img);
                thumbnailItem.appendChild(thumbnailImage);

                const thumbnailInfo = document.createElement('div');
                thumbnailInfo.className = 'thumbnail-info';

                const dateSpan = document.createElement('span');
                dateSpan.className = 'thumbnail-date';
                dateSpan.textContent = this.formatTime(image.timestamp).split(' ')[0];

                const deleteButton = document.createElement('button');
                deleteButton.type = 'button';
                deleteButton.className = 'thumbnail-delete';
                deleteButton.textContent = '\u00D7'; // × is the multiplication sign (×)
                deleteButton.onclick = (e) => {
                  e.stopPropagation();
                  this.deleteImage(image.id);
                };

                thumbnailInfo.appendChild(dateSpan);
                thumbnailInfo.appendChild(deleteButton);
                thumbnailItem.appendChild(thumbnailInfo);

                scrollContainer.appendChild(thumbnailItem);
              });

              console.log('Manually created', this.generatedImages.length, 'thumbnails');
            }
          }
        });

        this.isGeneratingImage = false;
        this.showImageGenDialog = false;
        this.showGeneratedImage = true;
        console.log('Image generation completed');
      }, 2000);
    },

    // Add image thumbnail node for a node
    addImageThumbnailNode(image) {
      // Get source node ID
      const sourceNodeId = image.sourceNodeId || this.selectedNode.id;
      const sourceNode = mindMapData[sourceNodeId];

      if (!sourceNode) {
        console.error('Source node not found:', sourceNodeId);
        return;
      }

      // Create image node ID
      const imageNodeId = `image_node_${image.id}`;

      // Create image node data
      mindMapData[imageNodeId] = {
        id: imageNodeId,
        label: 'Generated Ad Visual',
        details: `基于“${sourceNode.label}”生成的图像\n\n正面提示词: ${image.positivePrompt}\n反面提示词: ${image.negativePrompt}`,
        options: [],
        imageUrl: image.url,
        timestamp: image.timestamp
      };

      // If source node doesn't have options property, create one
      if (!sourceNode.options) {
        sourceNode.options = [];
      }

      // Add option to source node
      sourceNode.options.push({
        id: `option_to_image_${image.id}`,
        text: 'Generated Ad Visual',
        nextNode: imageNodeId
      });

      // Get source node element
      const sourceElement = this.graph.getCell(sourceNodeId);
      if (sourceElement) {
        // Get source node position and level
        const sourcePosition = sourceElement.position();
        const sourceLevel = sourceElement.get('level') || 0;

        // Create image node with special style
        const imageNode = this.createImageNodeShape(
          imageNodeId,
          'Generated Ad Visual',
          sourcePosition.x + 200,
          sourcePosition.y + 100,
          sourceLevel + 1,
          image.url
        );

        // Set level
        imageNode.set('level', sourceLevel + 1);

        // Create link
        const link = this.createLink(sourceNodeId, imageNodeId);

        // Add to graph
        this.graph.addCells([imageNode, link]);

        // Update selected node options
        if (sourceNodeId === this.selectedNode.id) {
          this.selectedNode.options = sourceNode.options;
        }
      }
    },

    // Create image node shape
    createImageNodeShape(id, label, x, y, _level = 0, imageUrl) {
      // Choose color based on level
      const fillColor = '#9c27b0'; // Purple for image nodes
      const strokeColor = '#7b1fa2';

      console.log('Creating image node:', id, 'Image URL:', imageUrl);

      // Use standard rectangle and SVG image
      const imageNode = new joint.shapes.standard.Rectangle({
        id: id,
        position: { x, y },
        size: { width: 160, height: 120 },
        attrs: {
          body: {
            fill: fillColor,
            stroke: strokeColor,
            rx: 10,
            ry: 10
          },
          label: {
            text: label,
            fill: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            textWrap: {
              width: 150,
              height: 20,
              ellipsis: true
            },
            refY: 0.15, // Move text to the top
            textVerticalAnchor: 'top'
          }
        },
        // Use custom markup to include image
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
          {
            tagName: 'image',
            selector: 'image',
          }
        ]
      });

      // Set image properties
      imageNode.attr({
        image: {
          'xlink:href': imageUrl,
          width: 120,
          height: 70,
          x: 20,
          y: 35,
          preserveAspectRatio: 'xMidYMid meet'
        }
      });

      // Add custom property to store image URL
      imageNode.prop('imageUrl', imageUrl);

      return imageNode;
    },

    // Save generated image
    saveGeneratedImage() {
      // In a real application, this should provide download functionality
      // Here we simulate the download process
      const link = document.createElement('a');
      link.href = this.generatedImage;
      link.download = `ai-advertising-visual-${Date.now()}.jpg`;
      link.click();
    },

    // Close image generator dialog
    closeImageGenerator() {
      this.showImageGenDialog = false;
    },

    // Close generated image
    closeGeneratedImage() {
      this.showGeneratedImage = false;
    },

    // Load generated images
    loadGeneratedImages() {
      try {
        const savedImages = localStorage.getItem('generatedImages');
        if (savedImages) {
          this.generatedImages = JSON.parse(savedImages);
          console.log('Loaded', this.generatedImages.length, 'images from local storage');

          // Ensure thumbnails container is visible
          this.$nextTick(() => {
            if (this.generatedImages.length > 0) {
              const thumbnailsContainer = document.getElementById('thumbnails-container');
              if (thumbnailsContainer) {
                thumbnailsContainer.style.display = 'block';
                thumbnailsContainer.style.visibility = 'visible';
                thumbnailsContainer.style.opacity = '1';
                console.log('Thumbnails container set to visible');

                // Force update thumbnail content
                const scrollContainer = thumbnailsContainer.querySelector('.thumbnails-scroll');
                if (scrollContainer) {
                  // Clear and re-add all images
                  scrollContainer.innerHTML = '';

                  // Manually create thumbnail elements
                  this.generatedImages.forEach(image => {
                    const thumbnailItem = document.createElement('div');
                    thumbnailItem.className = 'thumbnail-item';
                    thumbnailItem.onclick = () => this.viewThumbnail(image);

                    const thumbnailImage = document.createElement('div');
                    thumbnailImage.className = 'thumbnail-image';

                    const img = document.createElement('img');
                    img.src = image.url;
                    img.alt = 'Ad visual ' + image.id;
                    img.title = this.formatTime(image.timestamp);

                    thumbnailImage.appendChild(img);
                    thumbnailItem.appendChild(thumbnailImage);

                    const thumbnailInfo = document.createElement('div');
                    thumbnailInfo.className = 'thumbnail-info';

                    const dateSpan = document.createElement('span');
                    dateSpan.className = 'thumbnail-date';
                    dateSpan.textContent = this.formatTime(image.timestamp).split(' ')[0];

                    const deleteButton = document.createElement('button');
                    deleteButton.type = 'button';
                    deleteButton.className = 'thumbnail-delete';
                    deleteButton.textContent = '\u00D7'; // × is the multiplication sign (×)
                    deleteButton.onclick = (e) => {
                      e.stopPropagation();
                      this.deleteImage(image.id);
                    };

                    thumbnailInfo.appendChild(dateSpan);
                    thumbnailInfo.appendChild(deleteButton);
                    thumbnailItem.appendChild(thumbnailInfo);

                    scrollContainer.appendChild(thumbnailItem);
                  });

                  console.log('Manually created', this.generatedImages.length, 'thumbnails');
                }
              }
            }
          });
        } else {
          console.log('No images in local storage');
        }
      } catch (e) {
        console.error('Failed to load generated images from localStorage:', e);
      }
    },

    // View thumbnail
    viewThumbnail(image) {
      this.currentViewingImage = image;
      this.showEnlargedImage = true;
    },

    // Close enlarged image
    closeEnlargedImage() {
      this.showEnlargedImage = false;
      this.currentViewingImage = null;
    },

    // Delete image
    deleteImage(imageId) {
      const index = this.generatedImages.findIndex(img => img.id === imageId);
      if (index !== -1) {
        if (confirm('Are you sure you want to delete this image?')) {
          this.generatedImages.splice(index, 1);

          // Update local storage
          try {
            localStorage.setItem('generatedImages', JSON.stringify(this.generatedImages));
          } catch (e) {
            console.error('Failed to update localStorage after image deletion:', e);
          }

          // If currently viewing this image, close the enlarged view
          if (this.currentViewingImage && this.currentViewingImage.id === imageId) {
            this.closeEnlargedImage();
          }

          // Force update thumbnails container
          this.$nextTick(() => {
            const thumbnailsContainer = document.getElementById('thumbnails-container');
            if (thumbnailsContainer) {
              // If no images left, hide container
              if (this.generatedImages.length === 0) {
                thumbnailsContainer.style.display = 'none';
                return;
              }

              // Force update thumbnail content
              const scrollContainer = thumbnailsContainer.querySelector('.thumbnails-scroll');
              if (scrollContainer) {
                // Clear and re-add all images
                scrollContainer.innerHTML = '';

                // Manually create thumbnail elements
                this.generatedImages.forEach(image => {
                  const thumbnailItem = document.createElement('div');
                  thumbnailItem.className = 'thumbnail-item';
                  thumbnailItem.onclick = () => this.viewThumbnail(image);

                  const thumbnailImage = document.createElement('div');
                  thumbnailImage.className = 'thumbnail-image';

                  const img = document.createElement('img');
                  img.src = image.url;
                  img.alt = 'Ad visual ' + image.id;
                  img.title = this.formatTime(image.timestamp);

                  thumbnailImage.appendChild(img);
                  thumbnailItem.appendChild(thumbnailImage);

                  const thumbnailInfo = document.createElement('div');
                  thumbnailInfo.className = 'thumbnail-info';

                  const dateSpan = document.createElement('span');
                  dateSpan.className = 'thumbnail-date';
                  dateSpan.textContent = this.formatTime(image.timestamp).split(' ')[0];

                  const deleteButton = document.createElement('button');
                  deleteButton.type = 'button';
                  deleteButton.className = 'thumbnail-delete';
                  deleteButton.textContent = '\u00D7'; // × is the multiplication sign (×)
                  deleteButton.onclick = (e) => {
                    e.stopPropagation();
                    this.deleteImage(image.id);
                  };

                  thumbnailInfo.appendChild(dateSpan);
                  thumbnailInfo.appendChild(deleteButton);
                  thumbnailItem.appendChild(thumbnailInfo);

                  scrollContainer.appendChild(thumbnailItem);
                });

                console.log('After deletion, recreated', this.generatedImages.length, 'thumbnails');
              }
            }
          });
        }
      }
    },

    // Process user initial input
    processUserInput() {
      if (!this.userInitialInput.trim()) {
        alert('Please enter your requirement or question');
        return;
      }

      this.processingInput = true;

      // Update root node data
      mindMapData.root.label = 'Campaign Brief';
      mindMapData.root.details = this.userInitialInput;

      // Clear existing options
      mindMapData.root.options = [];

      // Simulate generating multiple child nodes
      setTimeout(() => {
        try {
          // Generate new child nodes
          this.generateResponseNodes();

          // Switch to mind map mode
          this.initialMode = false;

          // Initialize chart (no longer in initial mode)
          this.$nextTick(() => {
            // Reinitialize chart
            this.initMindMap();

            // Clear user path
            this.userPath = [];

            this.processingInput = false;
          });
        } catch (error) {
          console.error('Error processing user input:', error);
          this.processingInput = false;
          alert('Error processing input, please try again');
        }
      }, 2000);
    },

    // Generate response nodes
    generateResponseNodes() {
      // Simulate generating 4-6 response nodes
      const responseTypes = [
        { type: 'Target Audience Analysis', detail: 'Analyze the demographics, psychographics, and behavior of your target audience' },
        { type: 'Campaign Objectives', detail: 'Define clear, measurable goals for your advertising campaign' },
        { type: 'Creative Strategy', detail: 'Develop the creative approach, messaging, and visual identity' },
        { type: 'Media Planning', detail: 'Select the optimal channels and timing for your campaign' },
        { type: 'Budget Allocation', detail: 'Distribute resources effectively across campaign elements' },
        { type: 'Performance Metrics', detail: 'Establish KPIs and measurement framework for campaign success' }
      ];

      // Randomly select 4-6 different response types
      const numResponses = Math.floor(Math.random() * 3) + 4; // 4-6
      const shuffled = [...responseTypes].sort(() => 0.5 - Math.random());
      const selectedResponses = shuffled.slice(0, numResponses);

      // Create new nodes
      selectedResponses.forEach((response, index) => {
        const nodeId = `response_${index}`;

        // Create node data
        mindMapData[nodeId] = {
          id: nodeId,
          label: response.type,
          details: response.detail,
          options: []
        };

        // Add to root node options
        mindMapData.root.options.push({
          id: `option_${index}`,
          text: response.type,
          nextNode: nodeId
        });

        // Generate 2-3 child nodes for each response node
        this.generateChildNodes(nodeId, 2);
      });
    },

    // Generate child nodes for specified node
    generateChildNodes(parentId, depth) {
      if (depth <= 0) return;

      const parent = mindMapData[parentId];
      if (!parent) return;

      // Generate child nodes based on parent node type
      const numChildren = Math.floor(Math.random() * 2) + 2; // 2-3

      for (let i = 0; i < numChildren; i++) {
        const childId = `${parentId}_child_${i}`;
        const childLabel = this.generateChildLabel(parent.label, i);
        const childDetails = this.generateChildDetails(parent.label, childLabel);

        // Create child node data
        mindMapData[childId] = {
          id: childId,
          label: childLabel,
          details: childDetails,
          options: []
        };

        // Add to parent node options
        parent.options.push({
          id: `${parentId}_option_${i}`,
          text: childLabel,
          nextNode: childId
        });

        // Recursively generate deeper level child nodes
        this.generateChildNodes(childId, depth - 1);
      }
    },

    // Generate child node label
    generateChildLabel(parentLabel, index) {
      // Generate different child node labels based on parent node type
      const labelsByParentType = {
        'Target Audience Analysis': [
          'Demographics', 'Psychographics', 'Behavioral Analysis', 'Market Segmentation'
        ],
        'Campaign Objectives': [
          'Awareness Goals', 'Conversion Goals', 'Brand Positioning', 'ROI Targets'
        ],
        'Creative Strategy': [
          'Key Messaging', 'Visual Identity', 'Content Strategy', 'Brand Voice'
        ],
        'Media Planning': [
          'Channel Selection', 'Scheduling', 'Targeting Strategy', 'Budget Allocation'
        ],
        'Budget Allocation': [
          'Production Costs', 'Media Spend', 'Agency Fees', 'Contingency'
        ],
        'Performance Metrics': [
          'KPIs', 'Measurement Tools', 'Reporting Schedule', 'Success Criteria'
        ]
      };

      // Get label list corresponding to parent node type
      const labels = labelsByParentType[parentLabel] || [
        `Sub-element ${index + 1}`,
        `Key Point ${index + 1}`,
        `Consideration ${index + 1}`,
        `Important Aspect ${index + 1}`
      ];

      // Return label corresponding to index, or randomly select one
      return labels[index % labels.length] || labels[Math.floor(Math.random() * labels.length)];
    },

    // Generate child node details
    generateChildDetails(parentLabel, childLabel) {
      // Generate detail description based on parent and child node types
      const details = {
        'Demographics': 'Analyze age, gender, income, education, and location of the target audience.',
        'Psychographics': 'Understand values, interests, attitudes, and lifestyle factors that influence purchasing decisions.',
        'Behavioral Analysis': 'Examine purchasing patterns, brand loyalty, usage frequency, and decision-making processes.',
        'Market Segmentation': 'Identify distinct audience segments to tailor messaging and creative approaches.',
        'Awareness Goals': 'Define objectives for increasing brand recognition and recall among target audiences.',
        'Conversion Goals': 'Establish specific, measurable targets for customer actions and conversions.',
        'Brand Positioning': 'Articulate how the brand should be perceived relative to competitors in the market.',
        'ROI Targets': 'Set clear financial return expectations and measurement criteria for campaign success.'
      };

      // Return corresponding details, or generate generic details
      return details[childLabel] || `This is a detailed analysis of ${childLabel}, from the perspective of ${parentLabel}.`;
    },

    // Enable canvas panning and zooming
    enablePanning() {
      if (!this.paper) return;

      let dragStartPosition = null;
      let currentScale = 1; // Current zoom scale

      // Mouse down event
      this.paper.on('blank:pointerdown', (_, x, y) => {
        dragStartPosition = { x, y };

        // Add dragging style
        document.body.style.cursor = 'grabbing';
      });

      // Mouse move event
      this.paper.on('blank:pointermove', (_, x, y) => {
        if (dragStartPosition) {
          // Calculate movement distance
          const dx = x - dragStartPosition.x;
          const dy = y - dragStartPosition.y;

          // Update start position
          dragStartPosition = { x, y };

          // Move canvas
          const currentTranslate = this.paper.translate();
          this.paper.translate(currentTranslate.tx + dx, currentTranslate.ty + dy);
        }
      });

      // Mouse up event
      this.paper.on('blank:pointerup', () => {
        dragStartPosition = null;

        // Restore cursor style
        document.body.style.cursor = 'default';
      });

      // Mouse leave canvas event
      this.paper.el.addEventListener('mouseleave', () => {
        if (dragStartPosition) {
          dragStartPosition = null;

          // Restore cursor style
          document.body.style.cursor = 'default';
        }
      });

      // Add mouse wheel zoom functionality
      this.paper.el.addEventListener('wheel', (event) => {
        // Prevent default scroll behavior
        event.preventDefault();

        // Calculate zoom ratio
        const delta = event.deltaY;
        const scaleChange = delta > 0 ? 0.9 : 1.1; // Shrink or enlarge

        // Limit zoom range
        const newScale = Math.min(Math.max(currentScale * scaleChange, 0.3), 3);

        if (newScale !== currentScale) {
          // Get mouse position relative to canvas
          const offsetX = event.offsetX;
          const offsetY = event.offsetY;

          // Get current translation
          const translate = this.paper.translate();

          // Calculate new translation position to keep mouse position fixed
          const newTx = offsetX - (offsetX - translate.tx) * (newScale / currentScale);
          const newTy = offsetY - (offsetY - translate.ty) * (newScale / currentScale);

          // Apply zoom and translation
          this.paper.scale(newScale);
          this.paper.translate(newTx, newTy);

          // Update current zoom ratio
          currentScale = newScale;
        }
      }, { passive: false });

      // Add zoom control buttons
      this.addZoomControls();
    },

    // Add zoom control buttons
    addZoomControls() {
      // Create controls container
      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'zoom-controls';

      // Create zoom in button
      const zoomInButton = document.createElement('button');
      zoomInButton.innerHTML = '+';
      zoomInButton.title = 'Zoom In';
      zoomInButton.addEventListener('click', () => this.zoomIn());

      // Create zoom out button
      const zoomOutButton = document.createElement('button');
      zoomOutButton.innerHTML = '-';
      zoomOutButton.title = 'Zoom Out';
      zoomOutButton.addEventListener('click', () => this.zoomOut());

      // Create reset button
      const resetButton = document.createElement('button');
      resetButton.innerHTML = 'Reset';
      resetButton.title = 'Reset View';
      resetButton.addEventListener('click', () => this.resetView());

      // Add buttons to container
      controlsContainer.appendChild(zoomInButton);
      controlsContainer.appendChild(zoomOutButton);
      controlsContainer.appendChild(resetButton);

      // Add container to canvas container
      const mindmapContainer = this.$el.querySelector('.mindmap-container');
      if (mindmapContainer) {
        mindmapContainer.appendChild(controlsContainer);
      }
    },

    // Zoom in canvas
    zoomIn() {
      if (!this.paper) return;

      const currentScale = this.paper.scale().sx;
      const newScale = Math.min(currentScale * 1.2, 3);

      this.paper.scale(newScale);
    },

    // Zoom out canvas
    zoomOut() {
      if (!this.paper) return;

      const currentScale = this.paper.scale().sx;
      const newScale = Math.max(currentScale * 0.8, 0.3);

      this.paper.scale(newScale);
    },

    // Reset view
    resetView() {
      if (!this.paper) return;

      this.paper.scale(1);
      this.paper.translate(0, 0);
    },

    // Auto arrange layout
    autoLayout() {
      if (!this.graph) return;

      // Check if there are nodes
      const elements = this.graph.getElements();
      if (elements.length === 0) {
        alert('No nodes to arrange');
        return;
      }

      // Check if DirectedGraph plugin exists
      if (!joint.layout || !joint.layout.DirectedGraph) {
        console.error('DirectedGraph layout plugin not found');
        alert('Layout plugin missing, please refresh the page and try again');
        return;
      }

      // Show loading message
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'loading-message';
      loadingMsg.textContent = 'Arranging layout...';
      loadingMsg.style.position = 'absolute';
      loadingMsg.style.top = '50%';
      loadingMsg.style.left = '50%';
      loadingMsg.style.transform = 'translate(-50%, -50%)';
      loadingMsg.style.padding = '10px 20px';
      loadingMsg.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      loadingMsg.style.color = 'white';
      loadingMsg.style.borderRadius = '4px';
      loadingMsg.style.zIndex = '1000';

      const container = this.$el.querySelector('.mindmap-container');
      if (container) {
        container.appendChild(loadingMsg);
      }

      // Use timeout to allow UI update
      setTimeout(() => {
        try {
          // Use simple layout as fallback
          if (!this.useSimpleLayout()) {
            // If simple layout fails, try using JointJS auto layout algorithm
            joint.layout.DirectedGraph.layout(this.graph, {
              setVertices: false,
              setLabels: true,
              ranker: 'network-simplex',
              rankDir: 'TB', // Top to bottom layout
              align: 'UL', // Left align
              nodeSep: 80, // Horizontal distance between nodes
              edgeSep: 80, // Horizontal distance between edges
              rankSep: 100, // Vertical distance between layers
              marginX: 50, // Horizontal margin
              marginY: 50  // Vertical margin
            });
          }

          // Fine-tune node positions to prevent overlap
          this.adjustNodePositions();

          // Center the view
          this.centerContent();

          console.log('Auto layout completed');
        } catch (error) {
          console.error('Auto layout failed:', error);
          // Try using simple layout as fallback
          if (!this.useSimpleLayout()) {
            alert('Auto layout failed, please try again');
          } else {
            // If simple layout succeeds, don't show error
            this.centerContent();
          }
        } finally {
          // Remove loading message
          if (loadingMsg.parentNode) {
            loadingMsg.parentNode.removeChild(loadingMsg);
          }
        }
      }, 100);
    },

    // Use simple layout as fallback
    useSimpleLayout() {
      try {
        const elements = this.graph.getElements();
        if (elements.length === 0) return false;

        // Find root node
        const rootElement = this.graph.getCell('root') || elements[0];
        const rootPosition = rootElement.position();

        // Build node hierarchy structure
        const nodesByLevel = {};
        const processed = new Set();

        // Breadth-first traversal to build hierarchy structure
        const queue = [{ element: rootElement, level: 0 }];
        processed.add(rootElement.id);

        while (queue.length > 0) {
          const { element, level } = queue.shift();

          // Initialize array for current level
          if (!nodesByLevel[level]) {
            nodesByLevel[level] = [];
          }

          // Add to current level
          nodesByLevel[level].push(element);

          // Get all outgoing connections
          const outgoingLinks = this.graph.getConnectedLinks(element, { outbound: true });

          // Traverse all connected nodes
          for (const link of outgoingLinks) {
            const targetId = link.get('target').id;
            const targetElement = this.graph.getCell(targetId);

            if (targetElement && !processed.has(targetId)) {
              queue.push({ element: targetElement, level: level + 1 });
              processed.add(targetId);
            }
          }
        }

        // Layout nodes
        const levelHeight = 150; // Vertical distance between layers

        // Layout each level
        Object.entries(nodesByLevel).forEach(([level, nodes]) => {
          const levelNum = parseInt(level);
          const y = rootPosition.y + levelNum * levelHeight;

          // Calculate horizontal spacing between nodes
          const totalWidth = nodes.length * 180; // Assume each node width is 180
          const startX = rootPosition.x - totalWidth / 2 + 90; // Center layout

          // Set position for each node
          nodes.forEach((node, index) => {
            node.position(startX + index * 180, y);
          });
        });

        return true; // Indicates simple layout succeeded
      } catch (error) {
        console.error('Simple layout failed:', error);
        return false; // Indicates simple layout failed
      }
    },

    // Adjust node positions to prevent overlap
    adjustNodePositions() {
      const elements = this.graph.getElements();
      const nodePositions = {};
      const nodeSize = { width: 160, height: 60 };
      const padding = 20; // Minimum distance between nodes

      // First collect all node positions
      elements.forEach(element => {
        const position = element.position();
        nodePositions[element.id] = { x: position.x, y: position.y };
      });

      // Detect and resolve overlaps
      let iterations = 0;
      const maxIterations = 10; // Prevent infinite loop
      let hasOverlap = true;

      while (hasOverlap && iterations < maxIterations) {
        hasOverlap = false;
        iterations++;

        for (let i = 0; i < elements.length; i++) {
          const element1 = elements[i];
          const pos1 = nodePositions[element1.id];

          for (let j = i + 1; j < elements.length; j++) {
            const element2 = elements[j];
            const pos2 = nodePositions[element2.id];

            // Calculate distance between two nodes
            const dx = Math.abs(pos1.x - pos2.x);
            const dy = Math.abs(pos1.y - pos2.y);

            // Check if overlapping
            const overlapX = dx < (nodeSize.width + padding);
            const overlapY = dy < (nodeSize.height + padding);

            if (overlapX && overlapY) {
              hasOverlap = true;

              // Calculate distance to move
              const moveX = (nodeSize.width + padding - dx) / 2;
              const moveY = (nodeSize.height + padding - dy) / 2;

              // 根据相对位置决定移动方向
              if (dx > dy) {
                // 水平移动
                if (pos1.x < pos2.x) {
                  pos1.x -= moveX;
                  pos2.x += moveX;
                } else {
                  pos1.x += moveX;
                  pos2.x -= moveX;
                }
              } else {
                // 垂直移动
                if (pos1.y < pos2.y) {
                  pos1.y -= moveY;
                  pos2.y += moveY;
                } else {
                  pos1.y += moveY;
                  pos2.y -= moveY;
                }
              }
            }
          }
        }
      }

      // 应用新的位置
      elements.forEach(element => {
        const newPos = nodePositions[element.id];
        element.position(newPos.x, newPos.y);
      });
    },

    // 将内容居中
    centerContent() {
      if (!this.graph || !this.paper) return;

      const elements = this.graph.getElements();
      if (elements.length === 0) return;

      // 计算所有节点的边界框
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      elements.forEach(element => {
        const position = element.position();
        const size = element.size();

        minX = Math.min(minX, position.x);
        minY = Math.min(minY, position.y);
        maxX = Math.max(maxX, position.x + size.width);
        maxY = Math.max(maxY, position.y + size.height);
      });

      // 计算内容中心
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      const contentCenterX = minX + contentWidth / 2;
      const contentCenterY = minY + contentHeight / 2;

      // 获取画布尺寸
      const paperWidth = this.paper.options.width;
      const paperHeight = this.paper.options.height;

      // 计算平移量，使内容居中
      const tx = paperWidth / 2 - contentCenterX;
      const ty = paperHeight / 2 - contentCenterY;

      // 应用平移
      this.paper.translate(tx, ty);
    }
  }
});

// Mount the Vue app
app.mount('#app');
