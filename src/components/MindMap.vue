<template>
  <div class="mindmap-wrapper">
    <div ref="mindmapContainer" class="mindmap-container"></div>

    <!-- Context Menu -->
    <div v-if="showContextMenu" class="context-menu" :style="contextMenuStyle">
      <div class="context-menu-item" @click="addChildNode">Add Child Node</div>
      <div class="context-menu-item" @click="deleteNode">Delete Node</div>
      <div class="context-menu-item" @click="resetView">Reset View</div>
    </div>

    <!-- Node Details Panel -->
    <div v-if="showNodeDetails" class="node-details" :style="nodeDetailsStyle">
      <h3>{{ selectedNode.label }}</h3>
      <p>{{ selectedNode.details }}</p>
      <div class="node-actions">
        <button v-for="(option, index) in selectedNode.options"
                :key="index"
                @click="selectOption(option)">
          {{ option.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue';

export default {
  name: 'MindMap',
  setup() {
    // References and state
    const mindmapContainer = ref(null);
    const graph = ref(null);
    const paper = ref(null);
    const selectedNode = reactive({
      id: null,
      label: '',
      details: '',
      options: []
    });

    // Context menu state
    const showContextMenu = ref(false);
    const contextMenuStyle = reactive({
      top: '0px',
      left: '0px'
    });
    const contextMenuCell = ref(null);

    // Node details panel state
    const showNodeDetails = ref(false);
    const nodeDetailsStyle = reactive({
      top: '0px',
      left: '0px'
    });

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

    // Node and link shapes
    const createNodeShape = (id, label, x, y) => {
      // Use the global joint variable
      const shape = new window.joint.shapes.standard.Rectangle({
        id: id,
        position: { x, y },
        size: { width: 160, height: 60 },
        attrs: {
          body: {
            fill: '#3498db',
            stroke: '#2980b9',
            rx: 10,
            ry: 10
          },
          label: {
            text: label,
            fill: 'white',
            fontSize: 14,
            fontWeight: 'bold'
          }
        }
      });

      return shape;
    };

    const createLink = (sourceId, targetId) => {
      return new window.joint.shapes.standard.Link({
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
    };

    // Initialize the mind map
    const initMindMap = () => {
      // Create graph and paper
      graph.value = new window.joint.dia.Graph();
      paper.value = new window.joint.dia.Paper({
        el: mindmapContainer.value,
        model: graph.value,
        width: '100%',
        height: '100%',
        gridSize: 10,
        drawGrid: true,
        background: {
          color: '#f8f9fa'
        },
        interactive: true
      });

      // Create the initial tree structure
      const rootNode = createNodeShape('root', mindMapData.root.label, 400, 50);
      graph.value.addCell(rootNode);

      // Add first level children
      const firstLevelNodes = mindMapData.root.options.map((option, index) => {
        const node = createNodeShape(
          option.nextNode,
          mindMapData[option.nextNode].label,
          200 + index * 300,
          180
        );
        const link = createLink('root', option.nextNode);
        return [node, link];
      }).flat();

      graph.value.addCells(firstLevelNodes);

      // Set up event listeners
      setupEventListeners();
    };

    // Event listeners for the paper
    const setupEventListeners = () => {
      // Cell click event
      paper.value.on('cell:pointerclick', (cellView) => {
        const cell = cellView.model;
        if (cell.isElement()) {
          const nodeId = cell.id;
          const nodeData = mindMapData[nodeId];

          if (nodeData) {
            // Update selected node data
            selectedNode.id = nodeId;
            selectedNode.label = nodeData.label;
            selectedNode.details = nodeData.details;
            selectedNode.options = nodeData.options;

            // Show node details panel
            showNodeDetails.value = true;

            // Position the details panel near the node
            const position = cell.position();
            nodeDetailsStyle.top = `${position.y + 80}px`;
            nodeDetailsStyle.left = `${position.x + 80}px`;
          }
        }
      });

      // Background click to hide panels
      paper.value.on('blank:pointerclick', () => {
        showNodeDetails.value = false;
        showContextMenu.value = false;
      });

      // Right-click context menu
      paper.value.on('cell:contextmenu', (cellView, evt) => {
        evt.preventDefault();

        // Store the cell for context menu actions
        contextMenuCell.value = cellView.model;

        // Show context menu at mouse position
        showContextMenu.value = true;
        contextMenuStyle.top = `${evt.clientY}px`;
        contextMenuStyle.left = `${evt.clientX}px`;
      });
    };

    // Context menu actions
    const addChildNode = () => {
      if (!contextMenuCell.value || !contextMenuCell.value.isElement()) return;

      const parentId = contextMenuCell.value.id;
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
      const parentPosition = contextMenuCell.value.position();

      // Calculate new position (below parent, offset to the right)
      const childCount = parentNode.options.length;
      const xOffset = (childCount - 1) * 180 - 90;

      // Create and add the new node
      const newNode = createNodeShape(
        newNodeId,
        'New Node',
        parentPosition.x + xOffset,
        parentPosition.y + 150
      );

      const link = createLink(parentId, newNodeId);
      graph.value.addCells([newNode, link]);

      // Hide context menu
      showContextMenu.value = false;
    };

    const deleteNode = () => {
      if (!contextMenuCell.value || !contextMenuCell.value.isElement()) return;

      const nodeId = contextMenuCell.value.id;

      // Don't allow deleting the root node
      if (nodeId === 'root') return;

      // Remove from graph
      graph.value.removeCells(contextMenuCell.value);

      // Remove from data model
      delete mindMapData[nodeId];

      // Remove references from parent nodes
      Object.values(mindMapData).forEach(node => {
        if (node.options) {
          node.options = node.options.filter(option => option.nextNode !== nodeId);
        }
      });

      // Hide context menu and details panel
      showContextMenu.value = false;
      showNodeDetails.value = false;
    };

    const resetView = () => {
      paper.value.scale(1, 1);
      paper.value.translate(0, 0);
      showContextMenu.value = false;
    };

    // Node details actions
    const selectOption = (option) => {
      const nextNodeId = option.nextNode;
      const nextNode = mindMapData[nextNodeId];

      if (nextNode) {
        // Find the element in the graph
        const element = graph.value.getCell(nextNodeId);

        if (element) {
          // Center the view on the selected node
          paper.value.translate(
            paper.value.el.clientWidth / 2 - element.position().x - element.size().width / 2,
            paper.value.el.clientHeight / 2 - element.position().y - element.size().height / 2
          );

          // Update selected node
          selectedNode.id = nextNodeId;
          selectedNode.label = nextNode.label;
          selectedNode.details = nextNode.details;
          selectedNode.options = nextNode.options;

          // Update details panel position
          const position = element.position();
          nodeDetailsStyle.top = `${position.y + 80}px`;
          nodeDetailsStyle.left = `${position.x + 80}px`;
        }
      }
    };

    // Initialize on component mount
    onMounted(() => {
      initMindMap();
    });

    return {
      mindmapContainer,
      showContextMenu,
      contextMenuStyle,
      showNodeDetails,
      nodeDetailsStyle,
      selectedNode,
      addChildNode,
      deleteNode,
      resetView,
      selectOption
    };
  }
}
</script>

<style scoped>
.mindmap-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.mindmap-container {
  width: 100%;
  height: 100%;
}

.node-actions {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.node-actions button {
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.node-actions button:hover {
  background-color: #2d3748;
}
</style>
