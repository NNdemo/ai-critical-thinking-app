// Sample data for the mind map
const mindMapData = {
  root: {
    id: 'root',
    label: 'Start Here',
    details: 'This is the beginning of your critical thinking journey. Choose a direction to explore.',
    options: [
      {
        id: 'option1',
        text: 'Analyze Problem',
        nextNode: 'analyze'
      },
      {
        id: 'option2',
        text: 'Gather Information',
        nextNode: 'gather'
      },
      {
        id: 'option3',
        text: 'Consider Alternatives',
        nextNode: 'alternatives'
      }
    ]
  },
  analyze: {
    id: 'analyze',
    label: 'Analyze the Problem',
    details: 'Break down the problem into its components to understand it better.',
    options: [
      {
        id: 'analyze1',
        text: 'Identify Key Issues',
        nextNode: 'issues'
      },
      {
        id: 'analyze2',
        text: 'Define Constraints',
        nextNode: 'constraints'
      }
    ]
  },
  gather: {
    id: 'gather',
    label: 'Gather Information',
    details: 'Collect relevant data and facts to inform your decision.',
    options: [
      {
        id: 'gather1',
        text: 'Research Sources',
        nextNode: 'sources'
      },
      {
        id: 'gather2',
        text: 'Consult Experts',
        nextNode: 'experts'
      }
    ]
  },
  alternatives: {
    id: 'alternatives',
    label: 'Consider Alternatives',
    details: 'Explore different possible solutions or approaches.',
    options: [
      {
        id: 'alt1',
        text: 'Brainstorm Ideas',
        nextNode: 'brainstorm'
      },
      {
        id: 'alt2',
        text: 'Evaluate Options',
        nextNode: 'evaluate'
      }
    ]
  },
  issues: {
    id: 'issues',
    label: 'Identify Key Issues',
    details: 'Determine the most important aspects of the problem that need to be addressed.',
    options: []
  },
  constraints: {
    id: 'constraints',
    label: 'Define Constraints',
    details: 'Understand the limitations and boundaries that affect possible solutions.',
    options: []
  },
  sources: {
    id: 'sources',
    label: 'Research Sources',
    details: 'Find and evaluate reliable sources of information.',
    options: []
  },
  experts: {
    id: 'experts',
    label: 'Consult Experts',
    details: 'Seek advice from people with specialized knowledge or experience.',
    options: []
  },
  brainstorm: {
    id: 'brainstorm',
    label: 'Brainstorm Ideas',
    details: 'Generate as many potential solutions as possible without judging them initially.',
    options: []
  },
  evaluate: {
    id: 'evaluate',
    label: 'Evaluate Options',
    details: 'Assess each alternative based on criteria such as feasibility, cost, and effectiveness.',
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
      // 保存的思考路径
      savedPaths: [],
      // 显示保存路径对话框
      showSavePathDialog: false,
      // 显示加载路径对话框
      showLoadPathDialog: false,
      // 新路径名称
      newPathName: '',
      // 当前比较的路径
      comparisonPath: null,
      // 显示路径比较
      showPathComparison: false,
      // 显示路径比较对话框
      showPathComparisonDialog: false,
      // 路径比较结果
      pathComparisonResult: null,
      // 显示分享对话框
      showShareDialog: false,
      // 分享链接
      shareLink: '',
      // 分享评论
      shareComment: '',
      // 显示评论对话框
      showCommentsDialog: false,
      // 评论列表
      comments: [],
      // 新评论
      newComment: '',
      // 节点评价
      nodeRating: '',
      // 节点评价历史
      nodeRatings: {},
      // 文生图功能
      showImageGenDialog: false,
      // 生成的图像
      generatedImage: null,
      // 正面提示词
      positivePrompt: '',
      // 反面提示词
      negativePrompt: '',
      // 图像生成中
      isGeneratingImage: false,
      // 显示生成的图像
      showGeneratedImage: false,
      // 生成的图像列表
      generatedImages: [],
      // 当前查看的图像
      currentViewingImage: null,
      // 显示放大图像
      showEnlargedImage: false,
      // 初始界面模式
      initialMode: true,
      // 用户初始输入
      userInitialInput: '',
      // 正在处理用户输入
      processingInput: false
    };
  },
  mounted() {
    this.initMindMap();
    this.loadNodeRatings();
    this.loadGeneratedImages();
  },
  computed: {
    // 检查是否有选中的选项
    hasSelectedOptions() {
      return this.aiGeneratedOptions.some(option => option.selected);
    }
  },
  methods: {
    // Initialize the mind map
    initMindMap() {
      // 如果在初始模式，不初始化图表
      if (this.initialMode) {
        return;
      }

      // 在非初始模式下初始化图表
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
          width: '100%',
          height: '100%',
          gridSize: 10,
          drawGrid: true,
          background: {
            color: '#f8f9fa'
          },
          interactive: {
            elementMove: true,     // 允许元素拖拽
            linkMove: true,       // 允许连线拖拽
            vertexAdd: false,     // 不允许添加顶点
            vertexMove: false,    // 不允许移动顶点
            labelMove: false,     // 不允许移动标签
            arrowheadMove: false, // 不允许移动箭头
            useLinkTools: false   // 不使用连线工具
          }
        });

        // 启用画布拖拽
        this.enablePanning();

        // Create the initial tree structure
        const rootNode = this.createNodeShape('root', mindMapData.root.label, 400, 50, 0);
        rootNode.set('level', 0); // 设置根节点层级为0
        this.graph.addCell(rootNode);

        // Add first level children
        const firstLevelNodes = mindMapData.root.options.map((option, index) => {
          const node = this.createNodeShape(
            option.nextNode,
            mindMapData[option.nextNode].label,
            200 + index * 300,
            180,
            1 // 一级节点层级为1
          );
          node.set('level', 1); // 设置节点层级
          const link = this.createLink('root', option.nextNode);
          return [node, link];
        }).flat();

        this.graph.addCells(firstLevelNodes);

        // 选中根节点并显示详情
        this.selectedNode.id = 'root';
        this.selectedNode.label = mindMapData.root.label;
        this.selectedNode.details = mindMapData.root.details;
        this.selectedNode.options = mindMapData.root.options;
        this.showNodeDetails = true;

        // 设置节点详情面板位置
        const rootElement = this.graph.getCell('root');
        if (rootElement) {
          const position = rootElement.position();
          this.nodeDetailsStyle.top = `${position.y + 80}px`;
          this.nodeDetailsStyle.left = `${position.x + 80}px`;
        }

        // 显示AI生成按钮
        this.showAIGenerateButton = true;

        // Set up event listeners
        this.setupEventListeners();
      } catch (error) {
        console.error('Error initializing mind map:', error);
      }
    },

    // Create a node shape
    createNodeShape(id, label, x, y, level = 0) {
      // 根据文本长度调整字体大小
      let fontSize = 14;
      if (label.length > 20) {
        fontSize = 12;
      }
      if (label.length > 30) {
        fontSize = 10;
      }

      // 限制文本长度
      let displayLabel = label;
      if (label.length > 40) {
        displayLabel = label.substring(0, 37) + '...';
      }

      // 根据层级选择不同的颜色
      let fillColor = '#3498db';
      let strokeColor = '#2980b9';

      switch (level % 5) {
        case 0:
          fillColor = '#3498db'; // 蓝色
          strokeColor = '#2980b9';
          break;
        case 1:
          fillColor = '#2ecc71'; // 绿色
          strokeColor = '#27ae60';
          break;
        case 2:
          fillColor = '#9b59b6'; // 紫色
          strokeColor = '#8e44ad';
          break;
        case 3:
          fillColor = '#e67e22'; // 橙色
          strokeColor = '#d35400';
          break;
        case 4:
          fillColor = '#34495e'; // 深蓝色
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
      // 确保图表已初始化
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
            // Update selected node data
            this.selectedNode.id = nodeId;
            this.selectedNode.label = nodeData.label;
            this.selectedNode.details = nodeData.details;
            this.selectedNode.options = nodeData.options;

            // Show node details panel
            this.showNodeDetails = true;

            // 显示AI生成按钮，所有节点都可以生成AI选项
            this.showAIGenerateButton = true;

            // 不再需要根据节点位置调整详情面板位置，因为它现在是固定位置
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
        label: 'New Node',
        details: 'Add details for this new node',
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
        'New Node',
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

          // 记录用户选择的路径
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

          // 高亮显示路径
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

          // 如果节点没有选项，显示AI生成按钮
          if (nextNode.options.length === 0) {
            this.showAIGenerateButton = true;
          } else {
            this.showAIGenerateButton = false;
          }
        }
      }
    },

    // 高亮显示用户选择的路径
    highlightPath() {
      // 重置所有连接的样式
      this.graph.getLinks().forEach(link => {
        link.attr({
          line: {
            stroke: '#2980b9',
            strokeWidth: 2
          }
        });
      });

      // 高亮用户路径
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
        text: 'New Option',
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
            label: 'New Node',
            details: 'Add details for this new node',
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
              'New Node',
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

    // 显示AI生成选项对话框
    showAIGenerateDialog() {
      this.showAIOptions = false;
      this.aiGeneratedOptions = [];
      this.userPrompt = '';
      this.showAIGeneratePrompt = true;
    },

    // 生成AI选项
    generateAIOptions() {
      if (!this.userPrompt.trim()) {
        alert('请输入提示词以生成选项');
        return;
      }

      this.isGenerating = true;

      // 模拟 AI 生成过程
      setTimeout(() => {
        // 这里模拟 AI 生成的选项
        // 实际应用中应该调用后端 API
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

    // 模拟AI生成选项
    simulateAIGeneration(context) {
      // 基于当前节点和用户路径生成相关选项
      const options = [];
      const themes = [
        '深入分析', '批判性思考', '创造性解决',
        '系统性思考', '评估影响', '探索替代方案',
        '考虑不同角度', '识别潜在偏见', '寻找根本原因'
      ];

      // 生成 3-5 个选项
      const numOptions = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < numOptions; i++) {
        const theme = themes[Math.floor(Math.random() * themes.length)];
        let optionText = '';

        // 基于用户提示词生成不同的选项
        if (context.prompt.includes('问题') || context.prompt.includes('problem')) {
          optionText = `${theme}这个问题的各个方面`;
        } else if (context.prompt.includes('解决') || context.prompt.includes('solution')) {
          optionText = `${theme}可能的解决方案`;
        } else if (context.prompt.includes('思考') || context.prompt.includes('think')) {
          optionText = `${theme}这个问题的思考过程`;
        } else {
          optionText = `${theme}${context.prompt}的各个方面`;
        }

        options.push({
          id: `ai_option_${Date.now()}_${i}`,
          text: optionText,
          details: `这个选项将带领您${theme}相关的内容，探索${context.prompt}的不同角度。`,
          selected: false // 添加选中状态
        });
      }

      return options;
    },

    // 切换选项选中状态
    toggleOptionSelection(option) {
      // 切换选中状态
      option.selected = !option.selected;
    },

    // 应用选中的选项
    applySelectedOptions() {
      // 获取所有选中的选项
      const selectedOptions = this.aiGeneratedOptions.filter(option => option.selected);

      if (selectedOptions.length === 0) {
        alert('请至少选择一个选项');
        return;
      }

      // 当前节点ID
      const currentNodeId = this.selectedNode.id;
      const currentNode = mindMapData[currentNodeId];

      if (!currentNode.options) {
        currentNode.options = [];
      }

      // 记录新节点和连线
      const newCells = [];

      // 处理每个选中的选项
      selectedOptions.forEach((option, index) => {
        // 创建新节点
        const newNodeId = `node_${Date.now()}_${index}`;

        // 添加到数据模型
        mindMapData[newNodeId] = {
          id: newNodeId,
          label: option.text,
          details: option.details,
          options: []
        };

        // 添加选项到当前节点
        const newOption = {
          id: `option_${Date.now()}_${index}`,
          text: option.text,
          nextNode: newNodeId
        };

        currentNode.options.push(newOption);

        // 创建新节点在图中
        const parentElement = this.graph.getCell(currentNodeId);
        if (parentElement) {
          const parentPosition = parentElement.position();
          const childCount = currentNode.options.length;
          const optionIndex = currentNode.options.length - 1;
          const xOffset = (optionIndex - childCount / 2) * 180;

          // 获取当前节点的层级
          const parentLevel = parentElement.get('level') || 0;
          const nodeLevel = parentLevel + 1;

          // 创建新节点，并传入层级
          const newNode = this.createNodeShape(
            newNodeId,
            option.text,
            parentPosition.x + xOffset,
            parentPosition.y + 150,
            nodeLevel
          );

          // 存储层级信息
          newNode.set('level', nodeLevel);

          // 创建连线
          const link = this.createLink(currentNodeId, newNodeId);

          // 添加到新单元列表
          newCells.push(newNode, link);
        }
      });

      // 一次性添加所有新单元
      if (newCells.length > 0) {
        this.graph.addCells(newCells);
      }

      // 更新当前节点的选项
      this.selectedNode.options = currentNode.options;

      // 隐藏AI选项对话框
      this.showAIOptions = false;
      this.showAIGenerateButton = false;
    },

    // 选择单个AI生成的选项 (兼容旧版本)
    selectAIOption(option) {
      // 选中该选项
      option.selected = true;

      // 其他选项取消选中
      this.aiGeneratedOptions.forEach(opt => {
        if (opt !== option) {
          opt.selected = false;
        }
      });

      // 应用选中的选项
      this.applySelectedOptions();
    },

    // 选择思考类型
    selectThinkingType(type) {
      // 如果已经选中了该类型，则取消选中
      if (this.selectedThinkingType === type) {
        this.selectedThinkingType = null;
      } else {
        this.selectedThinkingType = type;
      }

      // 根据选中的思考类型生成提示词
      let prompt = '';

      switch (type) {
        case '根本原因':
          prompt = `探索「${this.selectedNode.label}」的根本原因和深层因素`;
          break;
        case '系统影响':
          prompt = `分析「${this.selectedNode.label}」的系统性影响和连锁效应`;
          break;
        case '潜在机会':
          prompt = `发现「${this.selectedNode.label}」中的潜在机会和可能的突破点`;
          break;
        default:
          return;
      }

      // 设置提示词并显示AI生成对话框
      this.userPrompt = prompt;
      this.showAIGeneratePrompt = true;
    },

    // 取消AI生成
    cancelAIGenerate() {
      this.showAIOptions = false;
      this.showAIGeneratePrompt = false;
    },

    // 生成路径分析
    generatePathAnalysis() {
      if (this.userPath.length === 0) {
        alert('还没有足够的路径数据进行分析');
        return;
      }

      this.isGenerating = true;

      // 模拟生成分析
      setTimeout(() => {
        this.pathAnalysis = this.simulatePathAnalysis();
        this.isGenerating = false;
        this.showPathAnalysis = true;
      }, 1500);
    },

    // 模拟路径分析
    simulatePathAnalysis() {
      // 基于用户路径生成分析
      const nodeNames = this.userPath.map(step => step.toNodeLabel);
      const startNode = this.userPath.length > 0 ? this.userPath[0].fromNodeLabel : '起点';

      return {
        summary: `您的思考路径从 ${startNode} 开始，经过了 ${nodeNames.join(' → ')} 等节点。这表明您关注的是问题的${nodeNames.length > 2 ? '多个方面和深度' : '基本方面'}。`,
        insights: [
          `您的思考路径展现了${nodeNames.includes('分析问题') ? '分析性' : '探索性'}思维模式。`,
          `您在思考过程中特别关注了${nodeNames[Math.floor(nodeNames.length / 2)]}这个环节。`,
          `您的思考路径展现了${this.userPath.length > 3 ? '深度思考' : '广度探索'}的特点。`
        ],
        recommendations: [
          `建议您可以进一步探索${nodeNames[nodeNames.length - 1]}的相关内容。`,
          `考虑将${startNode}和${nodeNames[nodeNames.length - 1]}进行对比分析。`,
          `尝试从不同角度思考这个问题，例如从相反的角度分析。`
        ]
      };
    },

    // 关闭路径分析
    closePathAnalysis() {
      this.showPathAnalysis = false;
    },

    // 显示保存路径对话框
    showSavePath() {
      this.newPathName = `思考路径 ${this.savedPaths.length + 1}`;
      this.showSavePathDialog = true;
    },

    // 保存当前思考路径
    saveCurrentPath() {
      if (!this.newPathName.trim()) {
        alert('请输入路径名称');
        return;
      }

      if (this.userPath.length === 0) {
        alert('还没有思考路径可保存');
        return;
      }

      // 创建路径对象
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

      // 添加到保存的路径中
      this.savedPaths.push(pathToSave);

      // 尝试保存到本地存储
      try {
        localStorage.setItem('savedPaths', JSON.stringify(this.savedPaths));
      } catch (e) {
        console.error('Failed to save paths to localStorage:', e);
      }

      this.showSavePathDialog = false;
      alert(`路径 "${this.newPathName}" 已保存成功！`);
    },

    // 取消保存路径
    cancelSavePath() {
      this.showSavePathDialog = false;
    },

    // 显示加载路径对话框
    showLoadPath() {
      // 尝试从本地存储加载路径
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

    // 加载选中的路径
    loadSelectedPath(path) {
      // 清除当前路径
      this.userPath = [];

      // 重置图形
      this.resetView();

      // 加载保存的路径
      this.userPath = JSON.parse(JSON.stringify(path.path));

      // 高亮显示路径
      this.highlightPath();

      // 如果有节点，选中最后一个节点
      if (this.userPath.length > 0) {
        const lastStep = this.userPath[this.userPath.length - 1];
        const lastNodeId = lastStep.toNodeId;
        const lastNode = mindMapData[lastNodeId];

        if (lastNode) {
          // 选中节点
          this.selectedNode.id = lastNodeId;
          this.selectedNode.label = lastNode.label;
          this.selectedNode.details = lastNode.details;
          this.selectedNode.options = lastNode.options;
          this.showNodeDetails = true;

          // 更新节点详情面板位置
          const element = this.graph.getCell(lastNodeId);
          if (element) {
            const position = element.position();
            this.nodeDetailsStyle.top = `${position.y + 80}px`;
            this.nodeDetailsStyle.left = `${position.x + 80}px`;

            // 将视图中心定位到该节点
            this.paper.translate(
              this.paper.el.clientWidth / 2 - position.x - element.size().width / 2,
              this.paper.el.clientHeight / 2 - position.y - element.size().height / 2
            );
          }

          // 所有节点都显示AI生成按钮
          this.showAIGenerateButton = true;
        }
      }

      this.showLoadPathDialog = false;
      alert(`路径 "${path.name}" 已加载成功！`);
    },

    // 删除保存的路径
    deleteSelectedPath(index) {
      if (confirm(`确定要删除路径 "${this.savedPaths[index].name}" 吗？`)) {
        this.savedPaths.splice(index, 1);

        // 更新本地存储
        try {
          localStorage.setItem('savedPaths', JSON.stringify(this.savedPaths));
        } catch (e) {
          console.error('Failed to update localStorage after deletion:', e);
        }
      }
    },

    // 取消加载路径
    cancelLoadPath() {
      this.showLoadPathDialog = false;
    },

    // 导出思考路径
    exportPath() {
      if (this.userPath.length === 0) {
        alert('还没有思考路径可导出');
        return;
      }

      // 创建要导出的数据
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
          title: 'AI Critical Thinking Tool - Exported Path',
          description: `思考路径从 ${this.userPath[0].fromNodeLabel} 开始，经过 ${this.userPath.length} 个节点`
        }
      };

      // 创建并下载文件
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `thinking-path-${new Date().toISOString().slice(0, 10)}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },

    // 导入思考路径
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

            // 验证导入的数据
            if (!importedData.path || !Array.isArray(importedData.path)) {
              throw new Error('无效的路径数据格式');
            }

            // 创建要保存的路径
            const pathToSave = {
              id: `path_${Date.now()}`,
              name: `导入的路径 ${new Date().toLocaleString()}`,
              path: importedData.path,
              timestamp: new Date().toISOString(),
              nodes: importedData.nodes || importedData.path.map(step => ({
                id: step.toNodeId,
                label: step.toNodeLabel
              }))
            };

            // 添加到保存的路径中
            this.savedPaths.push(pathToSave);

            // 更新本地存储
            try {
              localStorage.setItem('savedPaths', JSON.stringify(this.savedPaths));
            } catch (e) {
              console.error('Failed to save imported path to localStorage:', e);
            }

            alert(`路径已成功导入，并保存为 "${pathToSave.name}"。您可以从加载路径菜单中打开它。`);

          } catch (error) {
            alert(`导入失败: ${error.message}`);
            console.error('Import error:', error);
          }
        };

        reader.readAsText(file);
      };

      input.click();
    },

    // 显示路径比较对话框
    showComparePathDialog() {
      if (this.userPath.length === 0) {
        alert('还没有当前思考路径可供比较');
        return;
      }

      // 尝试从本地存储加载路径
      try {
        const savedPathsStr = localStorage.getItem('savedPaths');
        if (savedPathsStr) {
          this.savedPaths = JSON.parse(savedPathsStr);
        }
      } catch (e) {
        console.error('Failed to load paths from localStorage:', e);
      }

      if (this.savedPaths.length === 0) {
        alert('没有保存的路径可供比较，请先保存当前路径或加载其他路径');
        return;
      }

      this.showPathComparisonDialog = true;
    },

    // 比较选中的路径
    compareWithPath(path) {
      this.comparisonPath = path;

      // 生成比较分析
      this.pathComparisonResult = this.generatePathComparison(this.userPath, path.path);

      this.showPathComparisonDialog = false;
      this.showPathComparison = true;
    },

    // 生成路径比较分析
    generatePathComparison(currentPath, comparisonPath) {
      // 获取路径信息
      const currentPathNodes = currentPath.map(step => step.toNodeLabel);
      const comparisonPathNodes = comparisonPath.map(step => step.toNodeLabel);

      // 找出共同节点
      const commonNodes = currentPathNodes.filter(node => comparisonPathNodes.includes(node));

      // 找出不同节点
      const uniqueCurrentNodes = currentPathNodes.filter(node => !comparisonPathNodes.includes(node));
      const uniqueComparisonNodes = comparisonPathNodes.filter(node => !currentPathNodes.includes(node));

      // 计算路径长度差异
      const lengthDifference = Math.abs(currentPath.length - comparisonPath.length);

      // 计算相似度
      const similarity = commonNodes.length / Math.max(currentPathNodes.length, comparisonPathNodes.length);

      // 生成比较结果
      return {
        currentPathName: '当前路径',
        comparisonPathName: this.comparisonPath.name,
        currentPathLength: currentPath.length,
        comparisonPathLength: comparisonPath.length,
        commonNodes,
        uniqueCurrentNodes,
        uniqueComparisonNodes,
        lengthDifference,
        similarity: Math.round(similarity * 100),
        insights: [
          `两条路径的相似度为 ${Math.round(similarity * 100)}%，${similarity > 0.7 ? '非常相似' : similarity > 0.4 ? '有一定相似性' : '差异较大'}。`,
          `两条路径共有 ${commonNodes.length} 个相同的节点，分别有 ${uniqueCurrentNodes.length} 和 ${uniqueComparisonNodes.length} 个独有节点。`,
          `当前路径长度为 ${currentPath.length}，比较路径长度为 ${comparisonPath.length}，差异为 ${lengthDifference} 个节点。`
        ],
        recommendations: [
          uniqueComparisonNodes.length > 0 ? `可以考虑探索比较路径中的独有节点: ${uniqueComparisonNodes.join(', ')}。` : '没有可以探索的独有节点。',
          commonNodes.length > 0 ? `两条路径的共同节点可能是关键思考点: ${commonNodes.join(', ')}。` : '没有共同的思考节点。',
          similarity < 0.3 ? '两条路径差异较大，可以尝试结合两种思路进行更全面的思考。' : '两条路径有较多相似之处，可以尝试探索更多不同的角度。'
        ]
      };
    },

    // 关闭路径比较
    closePathComparison() {
      this.showPathComparison = false;
      this.comparisonPath = null;
    },

    // 取消路径比较
    cancelPathComparison() {
      this.showPathComparisonDialog = false;
    },

    // 显示分享对话框
    showShare() {
      if (this.userPath.length === 0) {
        alert('还没有思考路径可供分享');
        return;
      }

      // 生成分享链接
      // 在实际应用中，这里应该将数据发送到后端生成真实的分享链接

      // 在实际应用中，这里应该调用后端 API 生成真实的分享链接
      // 这里我们模拟一个链接
      const shareId = Math.random().toString(36).substring(2, 10);
      this.shareLink = `https://example.com/share/${shareId}`;

      this.shareComment = '';
      this.showShareDialog = true;
    },

    // 分享路径
    sharePath() {
      // 在实际应用中，这里应该将分享数据发送到后端
      alert(`分享链接已生成: ${this.shareLink}\n\n在实际应用中，这个链接将允许其他人查看您的思考路径。`);

      // 尝试复制到剪贴板
      try {
        navigator.clipboard.writeText(this.shareLink).then(() => {
          alert('链接已复制到剪贴板！');
        });
      } catch (e) {
        console.error('Failed to copy link:', e);
      }

      this.showShareDialog = false;
    },

    // 取消分享
    cancelShare() {
      this.showShareDialog = false;
    },

    // 显示评论对话框
    showComments() {
      // 模拟加载评论
      this.loadComments();
      this.showCommentsDialog = true;
    },

    // 加载评论
    loadComments() {
      // 在实际应用中，这里应该从后端加载评论
      // 这里我们模拟一些评论
      this.comments = [
        {
          id: 1,
          author: '用户A',
          text: '这个思考路径很有含量，特别是在分析问题的部分。',
          timestamp: new Date(Date.now() - 86400000).toISOString() // 1天前
        },
        {
          id: 2,
          author: '用户B',
          text: '我认为可以在“识别潜在偏见”这个方面再深入一些。',
          timestamp: new Date(Date.now() - 3600000).toISOString() // 1小时前
        }
      ];
    },

    // 添加评论
    addComment() {
      if (!this.newComment.trim()) {
        alert('请输入评论内容');
        return;
      }

      // 创建新评论
      const comment = {
        id: this.comments.length + 1,
        author: '当前用户', // 实际应用中应该使用真实用户名
        text: this.newComment,
        timestamp: new Date().toISOString()
      };

      // 添加到评论列表
      this.comments.push(comment);

      // 清空输入
      this.newComment = '';

      // 在实际应用中，这里应该将评论发送到后端
    },

    // 关闭评论对话框
    closeComments() {
      this.showCommentsDialog = false;
    },

    // 格式化时间
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },

    // 保存节点评价
    saveNodeRating() {
      if (!this.nodeRating.trim()) {
        return;
      }

      const nodeId = this.selectedNode.id;
      if (!nodeId) return;

      // 初始化节点评价历史
      if (!this.nodeRatings[nodeId]) {
        this.nodeRatings[nodeId] = [];
      }

      // 添加新评价
      this.nodeRatings[nodeId].push({
        id: Date.now(),
        text: this.nodeRating,
        timestamp: new Date().toISOString()
      });

      // 清空输入
      this.nodeRating = '';

      // 尝试保存到本地存储
      try {
        localStorage.setItem('nodeRatings', JSON.stringify(this.nodeRatings));
      } catch (e) {
        console.error('Failed to save node ratings to localStorage:', e);
      }
    },

    // 加载节点评价
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

    // 显示文生图对话框
    showImageGenerator() {
      // 生成正面提示词
      this.generatePromptsFromSelectedNode();

      this.showImageGenDialog = true;
    },

    // 从选中节点生成提示词
    generatePromptsFromSelectedNode() {
      if (!this.selectedNode || !this.selectedNode.id) {
        this.positivePrompt = '';
        this.negativePrompt = '';
        return;
      }

      const nodeId = this.selectedNode.id;
      const node = mindMapData[nodeId];

      if (!node) {
        this.positivePrompt = '';
        this.negativePrompt = '';
        return;
      }

      // 使用当前节点作为正面提示词
      this.positivePrompt = `${node.label}, ${node.details.split('.')[0]}`;

      // 获取所有节点ID
      const allNodeIds = Object.keys(mindMapData);

      // 收集反面提示词（不是当前节点的节点）
      const negativeNodeIds = allNodeIds.filter(id => id !== nodeId && id !== 'root');
      const negativeKeywords = negativeNodeIds
        .map(id => mindMapData[id])
        .filter(n => n) // 过滤掉不存在的节点
        .map(n => n.label);

      // 设置反面提示词
      this.negativePrompt = negativeKeywords.join(', ');
    },

    // 生成提示词
    generatePrompts() {
      // 获取当前路径节点
      const pathNodeIds = this.userPath.map(step => step.toNodeId);
      const pathNodes = pathNodeIds.map(id => mindMapData[id]);

      // 收集正面提示词
      const positiveKeywords = pathNodes
        .filter(node => node) // 过滤掉不存在的节点
        .map(node => {
          // 使用节点标签和详情作为关键词
          return `${node.label}, ${node.details.split('.')[0]}`;
        });

      // 获取所有节点ID
      const allNodeIds = Object.keys(mindMapData);

      // 收集反面提示词（不在路径中的节点）
      const negativeNodeIds = allNodeIds.filter(id => !pathNodeIds.includes(id) && id !== 'root');
      const negativeKeywords = negativeNodeIds
        .map(id => mindMapData[id])
        .filter(node => node) // 过滤掉不存在的节点
        .map(node => node.label);

      // 设置提示词
      this.positivePrompt = positiveKeywords.join(', ');
      this.negativePrompt = negativeKeywords.join(', ');
    },

    // 生成图像
    generateImage() {
      if (!this.positivePrompt.trim()) {
        alert('请输入正面提示词');
        return;
      }

      this.isGeneratingImage = true;

      // 模拟图像生成
      setTimeout(() => {
        // 在实际应用中，这里应该调用文生图 API
        // 这里我们使用随机图像模拟
        const imageSize = 512;
        const randomId = Math.floor(Math.random() * 1000);
        const imageUrl = `https://picsum.photos/seed/${randomId}/${imageSize}`;

        // 确保选中了节点
        if (!this.selectedNode || !this.selectedNode.id) {
          alert('请先选择一个节点');
          this.isGeneratingImage = false;
          return;
        }

        // 创建新图像对象
        const newImage = {
          id: `img_${Date.now()}`,
          url: imageUrl,
          positivePrompt: this.positivePrompt,
          negativePrompt: this.negativePrompt,
          timestamp: new Date().toISOString(),
          pathNodeIds: [],  // 不再依赖用户路径
          sourceNodeId: this.selectedNode.id // 添加源节点ID
        };

        // 添加到图像列表
        this.generatedImages.unshift(newImage);
        this.generatedImage = imageUrl;

        // 尝试保存到本地存储
        try {
          localStorage.setItem('generatedImages', JSON.stringify(this.generatedImages));
        } catch (e) {
          console.error('Failed to save generated images to localStorage:', e);
        }

        // 为当前节点添加图像缩略图子节点
        this.addImageThumbnailNode(newImage);

        this.isGeneratingImage = false;
        this.showImageGenDialog = false;
        this.showGeneratedImage = true;
      }, 2000);
    },

    // 为节点添加图像缩略图子节点
    addImageThumbnailNode(image) {
      // 获取源节点ID
      const sourceNodeId = image.sourceNodeId || this.selectedNode.id;
      const sourceNode = mindMapData[sourceNodeId];

      if (!sourceNode) {
        console.error('Source node not found:', sourceNodeId);
        return;
      }

      // 创建图像节点ID
      const imageNodeId = `image_node_${image.id}`;

      // 创建图像节点数据
      mindMapData[imageNodeId] = {
        id: imageNodeId,
        label: '生成的图像',
        details: `基于“${sourceNode.label}”生成的图像\n\n正面提示词: ${image.positivePrompt}\n反面提示词: ${image.negativePrompt}`,
        options: [],
        imageUrl: image.url,
        timestamp: image.timestamp
      };

      // 如果源节点没有options属性，创建一个
      if (!sourceNode.options) {
        sourceNode.options = [];
      }

      // 添加选项到源节点
      sourceNode.options.push({
        id: `option_to_image_${image.id}`,
        text: '生成的图像',
        nextNode: imageNodeId
      });

      // 获取源节点元素
      const sourceElement = this.graph.getCell(sourceNodeId);
      if (sourceElement) {
        // 获取源节点位置和层级
        const sourcePosition = sourceElement.position();
        const sourceLevel = sourceElement.get('level') || 0;

        // 创建图像节点，使用特殊样式
        const imageNode = this.createImageNodeShape(
          imageNodeId,
          '生成的图像',
          sourcePosition.x + 200,
          sourcePosition.y + 100,
          sourceLevel + 1,
          image.url
        );

        // 设置层级
        imageNode.set('level', sourceLevel + 1);

        // 创建连线
        const link = this.createLink(sourceNodeId, imageNodeId);

        // 添加到图中
        this.graph.addCells([imageNode, link]);

        // 更新选中节点的选项
        if (sourceNodeId === this.selectedNode.id) {
          this.selectedNode.options = sourceNode.options;
        }
      }
    },

    // 创建图像节点形状
    createImageNodeShape(id, label, x, y, _level = 0, imageUrl) {
      // 根据层级选择颜色
      const fillColor = '#9c27b0'; // 紫色为图像节点
      const strokeColor = '#7b1fa2';

      // 创建自定义图像节点
      const imageNode = new joint.shapes.standard.Rectangle({
        id: id,
        position: { x, y },
        size: { width: 160, height: 80 }, // 增加高度以容纳图像
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
            refY: 0.2 // 将文本移到顶部
          }
        }
      });

      // 添加图像元素
      // 注意：JointJS不直接支持在节点中嵌入图像，我们使用自定义标记
      imageNode.attr({
        '.image-icon': {
          'xlink:href': imageUrl,
          width: 40,
          height: 40,
          x: 60,
          y: 30,
          opacity: 1,
          refX: 0.5,
          refY: 0.7
        }
      });

      // 添加图像标记
      imageNode.attr('image', {
        'xlink:href': imageUrl,
        width: 40,
        height: 40,
        x: 60,
        y: 30,
        refX: 0.5,
        refY: 0.7
      });

      return imageNode;
    },

    // 保存生成的图像
    saveGeneratedImage() {
      // 在实际应用中，这里应该提供下载功能
      // 这里我们模拟下载过程
      const link = document.createElement('a');
      link.href = this.generatedImage;
      link.download = `ai-thinking-image-${Date.now()}.jpg`;
      link.click();
    },

    // 关闭图像生成对话框
    closeImageGenerator() {
      this.showImageGenDialog = false;
    },

    // 关闭生成的图像
    closeGeneratedImage() {
      this.showGeneratedImage = false;
    },

    // 加载生成的图像
    loadGeneratedImages() {
      try {
        const savedImages = localStorage.getItem('generatedImages');
        if (savedImages) {
          this.generatedImages = JSON.parse(savedImages);
        }
      } catch (e) {
        console.error('Failed to load generated images from localStorage:', e);
      }
    },

    // 查看缩略图
    viewThumbnail(image) {
      this.currentViewingImage = image;
      this.showEnlargedImage = true;
    },

    // 关闭放大图像
    closeEnlargedImage() {
      this.showEnlargedImage = false;
      this.currentViewingImage = null;
    },

    // 删除图像
    deleteImage(imageId) {
      const index = this.generatedImages.findIndex(img => img.id === imageId);
      if (index !== -1) {
        if (confirm('确定要删除这个图像吗？')) {
          this.generatedImages.splice(index, 1);

          // 更新本地存储
          try {
            localStorage.setItem('generatedImages', JSON.stringify(this.generatedImages));
          } catch (e) {
            console.error('Failed to update localStorage after image deletion:', e);
          }

          // 如果当前正在查看该图像，关闭放大图
          if (this.currentViewingImage && this.currentViewingImage.id === imageId) {
            this.closeEnlargedImage();
          }
        }
      }
    },

    // 处理用户初始输入
    processUserInput() {
      if (!this.userInitialInput.trim()) {
        alert('请输入您的需求或问题');
        return;
      }

      this.processingInput = true;

      // 更新根节点数据
      mindMapData.root.label = '您的需求';
      mindMapData.root.details = this.userInitialInput;

      // 清除现有选项
      mindMapData.root.options = [];

      // 模拟生成多个子节点
      setTimeout(() => {
        try {
          // 生成新的子节点
          this.generateResponseNodes();

          // 切换到思维导图模式
          this.initialMode = false;

          // 初始化图表（现在不再是初始模式）
          this.$nextTick(() => {
            // 重新初始化图表
            this.initMindMap();

            // 清除用户路径
            this.userPath = [];

            this.processingInput = false;
          });
        } catch (error) {
          console.error('Error processing user input:', error);
          this.processingInput = false;
          alert('处理输入时出错，请重试');
        }
      }, 2000);
    },

    // 生成响应节点
    generateResponseNodes() {
      // 模拟生成 4-6 个响应节点
      const responseTypes = [
        { type: '问题分析', detail: '分析您提出的问题的各个方面和核心要点' },
        { type: '解决方案', detail: '提供可行的解决方案和实施步骤' },
        { type: '深入思考', detail: '探索问题背后的深层原因和影响因素' },
        { type: '替代角度', detail: '从不同的角度和立场看待这个问题' },
        { type: '潜在风险', detail: '识别可能的风险和需要注意的问题' },
        { type: '实施计划', detail: '制定具体的行动计划和时间表' }
      ];

      // 随机选择 4-6 个不同的响应类型
      const numResponses = Math.floor(Math.random() * 3) + 4; // 4-6
      const shuffled = [...responseTypes].sort(() => 0.5 - Math.random());
      const selectedResponses = shuffled.slice(0, numResponses);

      // 创建新节点
      selectedResponses.forEach((response, index) => {
        const nodeId = `response_${index}`;

        // 创建节点数据
        mindMapData[nodeId] = {
          id: nodeId,
          label: response.type,
          details: response.detail,
          options: []
        };

        // 添加到根节点的选项中
        mindMapData.root.options.push({
          id: `option_${index}`,
          text: response.type,
          nextNode: nodeId
        });

        // 为每个响应节点生成 2-3 个子节点
        this.generateChildNodes(nodeId, 2);
      });
    },

    // 为指定节点生成子节点
    generateChildNodes(parentId, depth) {
      if (depth <= 0) return;

      const parent = mindMapData[parentId];
      if (!parent) return;

      // 根据父节点类型生成子节点
      const numChildren = Math.floor(Math.random() * 2) + 2; // 2-3

      for (let i = 0; i < numChildren; i++) {
        const childId = `${parentId}_child_${i}`;
        const childLabel = this.generateChildLabel(parent.label, i);
        const childDetails = this.generateChildDetails(parent.label, childLabel);

        // 创建子节点数据
        mindMapData[childId] = {
          id: childId,
          label: childLabel,
          details: childDetails,
          options: []
        };

        // 添加到父节点的选项中
        parent.options.push({
          id: `${parentId}_option_${i}`,
          text: childLabel,
          nextNode: childId
        });

        // 递归生成更深层次的子节点
        this.generateChildNodes(childId, depth - 1);
      }
    },

    // 生成子节点标签
    generateChildLabel(parentLabel, index) {
      // 根据父节点类型生成不同的子节点标签
      const labelsByParentType = {
        '问题分析': [
          '核心问题', '相关因素', '影响范围', '关键利益方'
        ],
        '解决方案': [
          '短期方案', '长期策略', '资源需求', '实施步骤'
        ],
        '深入思考': [
          '根本原因', '系统影响', '潜在机会', '历史经验'
        ],
        '替代角度': [
          '用户角度', '管理角度', '技术角度', '商业角度'
        ],
        '潜在风险': [
          '技术风险', '资源风险', '时间风险', '外部因素'
        ],
        '实施计划': [
          '阶段目标', '时间表', '资源分配', '进度跟踪'
        ]
      };

      // 获取对应父节点类型的标签列表
      const labels = labelsByParentType[parentLabel] || [
        `子项目 ${index + 1}`,
        `关键点 ${index + 1}`,
        `考虑因素 ${index + 1}`,
        `重要方面 ${index + 1}`
      ];

      // 返回对应索引的标签，或随机选择一个
      return labels[index % labels.length] || labels[Math.floor(Math.random() * labels.length)];
    },

    // 生成子节点详情
    generateChildDetails(parentLabel, childLabel) {
      // 根据父节点和子节点类型生成详情描述
      const details = {
        '核心问题': '详细分析问题的核心和本质，找出需要解决的关键点。',
        '相关因素': '识别影响这个问题的各种因素和条件，包括内部和外部因素。',
        '影响范围': '评估这个问题的影响范围和程度，包括短期和长期影响。',
        '关键利益方': '确定与这个问题相关的各方利益相关者及其需求和期望。',
        '短期方案': '提供可以快速实施的短期解决方案，帮助立即缓解问题。',
        '长期策略': '制定长期策略和方案，从根本上解决问题并防止再次发生。',
        '资源需求': '评估实施解决方案所需的资源，包括人力、物力和财力。',
        '实施步骤': '详细列出实施解决方案的具体步骤和行动计划。'
      };

      // 返回对应的详情，或生成通用详情
      return details[childLabel] || `这是关于${childLabel}的详细分析和说明，基于${parentLabel}的角度。`;
    },

    // 启用画布拖拽和缩放功能
    enablePanning() {
      if (!this.paper) return;

      let dragStartPosition = null;
      let currentScale = 1; // 当前缩放比例

      // 鼠标按下事件
      this.paper.on('blank:pointerdown', (_, x, y) => {
        dragStartPosition = { x, y };

        // 添加拖拽样式
        document.body.style.cursor = 'grabbing';
      });

      // 鼠标移动事件
      this.paper.on('blank:pointermove', (_, x, y) => {
        if (dragStartPosition) {
          // 计算移动距离
          const dx = x - dragStartPosition.x;
          const dy = y - dragStartPosition.y;

          // 更新起始位置
          dragStartPosition = { x, y };

          // 移动画布
          const currentTranslate = this.paper.translate();
          this.paper.translate(currentTranslate.tx + dx, currentTranslate.ty + dy);
        }
      });

      // 鼠标松开事件
      this.paper.on('blank:pointerup', () => {
        dragStartPosition = null;

        // 恢复鼠标样式
        document.body.style.cursor = 'default';
      });

      // 鼠标离开画布事件
      this.paper.el.addEventListener('mouseleave', () => {
        if (dragStartPosition) {
          dragStartPosition = null;

          // 恢复鼠标样式
          document.body.style.cursor = 'default';
        }
      });

      // 添加鼠标滚轮缩放功能
      this.paper.el.addEventListener('wheel', (event) => {
        // 阻止默认滚动行为
        event.preventDefault();

        // 计算缩放比例
        const delta = event.deltaY;
        const scaleChange = delta > 0 ? 0.9 : 1.1; // 缩小或放大

        // 限制缩放范围
        const newScale = Math.min(Math.max(currentScale * scaleChange, 0.3), 3);

        if (newScale !== currentScale) {
          // 获取鼠标相对于画布的位置
          const offsetX = event.offsetX;
          const offsetY = event.offsetY;

          // 获取当前平移
          const translate = this.paper.translate();

          // 计算新的平移位置，使鼠标位置保持不变
          const newTx = offsetX - (offsetX - translate.tx) * (newScale / currentScale);
          const newTy = offsetY - (offsetY - translate.ty) * (newScale / currentScale);

          // 应用缩放和平移
          this.paper.scale(newScale);
          this.paper.translate(newTx, newTy);

          // 更新当前缩放比例
          currentScale = newScale;
        }
      }, { passive: false });

      // 添加缩放控制按钮
      this.addZoomControls();
    },

    // 添加缩放控制按钮
    addZoomControls() {
      // 创建控制器容器
      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'zoom-controls';

      // 创建放大按钮
      const zoomInButton = document.createElement('button');
      zoomInButton.innerHTML = '+';
      zoomInButton.title = '放大';
      zoomInButton.addEventListener('click', () => this.zoomIn());

      // 创建缩小按钮
      const zoomOutButton = document.createElement('button');
      zoomOutButton.innerHTML = '-';
      zoomOutButton.title = '缩小';
      zoomOutButton.addEventListener('click', () => this.zoomOut());

      // 创建重置按钮
      const resetButton = document.createElement('button');
      resetButton.innerHTML = '重置';
      resetButton.title = '重置视图';
      resetButton.addEventListener('click', () => this.resetView());

      // 添加按钮到容器
      controlsContainer.appendChild(zoomInButton);
      controlsContainer.appendChild(zoomOutButton);
      controlsContainer.appendChild(resetButton);

      // 添加容器到画布容器
      const mindmapContainer = this.$el.querySelector('.mindmap-container');
      if (mindmapContainer) {
        mindmapContainer.appendChild(controlsContainer);
      }
    },

    // 放大画布
    zoomIn() {
      if (!this.paper) return;

      const currentScale = this.paper.scale().sx;
      const newScale = Math.min(currentScale * 1.2, 3);

      this.paper.scale(newScale);
    },

    // 缩小画布
    zoomOut() {
      if (!this.paper) return;

      const currentScale = this.paper.scale().sx;
      const newScale = Math.max(currentScale * 0.8, 0.3);

      this.paper.scale(newScale);
    },

    // 重置视图
    resetView() {
      if (!this.paper) return;

      this.paper.scale(1);
      this.paper.translate(0, 0);
    },

    // 自动整理布局
    autoLayout() {
      if (!this.graph) return;

      // 检查是否有节点
      const elements = this.graph.getElements();
      if (elements.length === 0) {
        alert('没有节点可以整理');
        return;
      }

      // 检查是否有 DirectedGraph 插件
      if (!joint.layout || !joint.layout.DirectedGraph) {
        console.error('DirectedGraph layout plugin not found');
        alert('缺少布局插件，请刷新页面后重试');
        return;
      }

      // 显示加载中提示
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'loading-message';
      loadingMsg.textContent = '正在整理布局...';
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

      // 使用延时执行，以允许UI更新
      setTimeout(() => {
        try {
          // 使用简单布局作为备选
          if (!this.useSimpleLayout()) {
            // 如果简单布局失败，尝试使用JointJS的自动布局算法
            joint.layout.DirectedGraph.layout(this.graph, {
              setVertices: false,
              setLabels: true,
              ranker: 'network-simplex',
              rankDir: 'TB', // 从上到下的布局
              align: 'UL', // 左对齐
              nodeSep: 80, // 节点间的水平间距
              edgeSep: 80, // 边之间的水平间距
              rankSep: 100, // 层与层之间的垂直间距
              marginX: 50, // 水平边距
              marginY: 50  // 垂直边距
            });
          }

          // 微调节点位置，防止重叠
          this.adjustNodePositions();

          // 将视图居中
          this.centerContent();

          console.log('自动整理完成');
        } catch (error) {
          console.error('Auto layout failed:', error);
          // 尝试使用简单布局作为备选
          if (!this.useSimpleLayout()) {
            alert('自动整理失败，请重试');
          } else {
            // 如果简单布局成功，不显示错误
            this.centerContent();
          }
        } finally {
          // 移除加载提示
          if (loadingMsg.parentNode) {
            loadingMsg.parentNode.removeChild(loadingMsg);
          }
        }
      }, 100);
    },

    // 使用简单布局作为备选
    useSimpleLayout() {
      try {
        const elements = this.graph.getElements();
        if (elements.length === 0) return false;

        // 找到根节点
        const rootElement = this.graph.getCell('root') || elements[0];
        const rootPosition = rootElement.position();

        // 构建节点层次结构
        const nodesByLevel = {};
        const processed = new Set();

        // 广度优先遍历构建层次结构
        const queue = [{ element: rootElement, level: 0 }];
        processed.add(rootElement.id);

        while (queue.length > 0) {
          const { element, level } = queue.shift();

          // 初始化当前层的数组
          if (!nodesByLevel[level]) {
            nodesByLevel[level] = [];
          }

          // 添加到当前层
          nodesByLevel[level].push(element);

          // 获取所有出连接
          const outgoingLinks = this.graph.getConnectedLinks(element, { outbound: true });

          // 遍历所有相连的节点
          for (const link of outgoingLinks) {
            const targetId = link.get('target').id;
            const targetElement = this.graph.getCell(targetId);

            if (targetElement && !processed.has(targetId)) {
              queue.push({ element: targetElement, level: level + 1 });
              processed.add(targetId);
            }
          }
        }

        // 布局节点
        const levelHeight = 150; // 层与层之间的垂直距离

        // 对每一层进行布局
        Object.entries(nodesByLevel).forEach(([level, nodes]) => {
          const levelNum = parseInt(level);
          const y = rootPosition.y + levelNum * levelHeight;

          // 计算节点间的水平间距
          const totalWidth = nodes.length * 180; // 假设每个节点宽度为180
          const startX = rootPosition.x - totalWidth / 2 + 90; // 居中布局

          // 设置每个节点的位置
          nodes.forEach((node, index) => {
            node.position(startX + index * 180, y);
          });
        });

        return true; // 表示简单布局成功
      } catch (error) {
        console.error('Simple layout failed:', error);
        return false; // 表示简单布局失败
      }
    },

    // 调整节点位置，防止重叠
    adjustNodePositions() {
      const elements = this.graph.getElements();
      const nodePositions = {};
      const nodeSize = { width: 160, height: 60 };
      const padding = 20; // 节点间的最小间距

      // 首先收集所有节点的位置
      elements.forEach(element => {
        const position = element.position();
        nodePositions[element.id] = { x: position.x, y: position.y };
      });

      // 检测并解决重叠
      let iterations = 0;
      const maxIterations = 10; // 防止无限循环
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

            // 计算两个节点之间的距离
            const dx = Math.abs(pos1.x - pos2.x);
            const dy = Math.abs(pos1.y - pos2.y);

            // 检查是否重叠
            const overlapX = dx < (nodeSize.width + padding);
            const overlapY = dy < (nodeSize.height + padding);

            if (overlapX && overlapY) {
              hasOverlap = true;

              // 计算需要移动的距离
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
