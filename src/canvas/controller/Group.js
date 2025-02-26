import Layer from './Layer'

export default class Group extends Layer {


	/**********************************************************************
	 * Set visibility
	 **********************************************************************/
	setGroupHide (id, hidden) {
		this.logger.log(-1,"setGroupHide", "enter > " + id, hidden);

		const group = this.model.groups[id]
		if (group) {
			this.startModelChange()
			const old = group.props ? group.props.hidden : false

			const command = {
				timestamp : new Date().getTime(),
				type : "HideGroup",
				groupId: id,
				n: hidden,
				o: old
			};

			this.modelUpdateGroupHidden(id, hidden)
			this.addCommand(command);
			this.commitModelChange()
		} else {
			this.logger.warn("updateGroup", "could not find group > " + id);
		}

		
	}

	modelUpdateGroupHidden (id, value) {
		const group = this.model.groups[id]
		if (group) {
			
			const children = this.getAllGroupChildren(group)
			children.forEach(childId => {
				if (this.model.widgets[childId]) {
					const child = this.model.widgets[childId]
					child.props.hidden = value
				}	
			})

			//let childGrou
		}
		this.onModelChanged([{type: 'group', action:"change", id: id}])
		this.render()
	}

	undoHideGroup(command) {
		this.logger.log(0,"undoUpdateGroup", "enter > " + command.id);
		this.modelUpdateGroup(command.groupId, command.o)
	}

	redoHideGroup (command) {
		this.logger.log(0,"undoUpdateGroup", "enter > " +command.id);
		this.modelUpdateGroup(command.groupId, command.n)
	}


	/**********************************************************************
	 * Update Group
	 **********************************************************************/


	updateGroup (id, type, key, value) {
		this.logger.log(-1,"updateGroup", "enter > " + id, type);

		const group = this.model.groups[id]
		if (group) {
			this.startModelChange()
			const old = group[type] ? group[type][key] : null

			const command = {
				timestamp : new Date().getTime(),
				type : "UpdateGroup",
				groupId: id,
				t: type,
				k: key,
				n: value,
				o: old
			};

			this.modelUpdateGroup(id, type, key, value)
			this.addCommand(command);
			this.commitModelChange(false, true)
		} else {
			this.logger.warn("updateGroup", "could not find group > " + id);
		}

	

	}

	modelUpdateGroup (id, type, key, value) {
		let group = this.model.groups[id]
		if (group) {
			if (!group[type]) {
				group[type] = {}
			}
			group[type][key] = value
		}
		this.onModelChanged([{type: 'group', action:"change", id: id}])
	}

	undoUpdateGroup(command) {
		this.logger.log(0,"undoUpdateGroup", "enter > " + command.id);
		this.modelUpdateGroup(command.groupId, command.t, command.k, command.o)
	}

	redoUpdateGroup (command) {
		this.logger.log(0,"undoUpdateGroup", "enter > " +command.id);
		this.modelUpdateGroup(command.groupId, command.t, command.k, command.n)
	}

	/**********************************************************************
	 * Multi Styles
	 **********************************************************************/

	updateMultiProperties (ids, props, type){
		this.logger.log(1,"updateMultiProperties", "enter > " + type, props);

		this.startModelChange()
		/**
		 * 1) create multi command
		 */
		const command = {
			timestamp : new Date().getTime(),
			type : "MultiCommand",
			label : "UpdateGroupProps",
			children :[]
		};

		/**
		 * Hack because some styles are by
		 * default null (which is rendered as solid)
		 */
		const ignoreStyles = ["borderTopStyle", "borderBottomStyle", "borderRightStyle", "borderLeftStyle", "fontWeight",
							"fontStyle", "textDecoration", "boxShadow", "textShadow", "opacity", "fixed"];

		for(let i=0; i< ids.length; i++){
			/**
			 * we just assume the object was already cloned.
			 * we just give new id and set position
			 */
			const id = ids[i];
			const widget = this.model.widgets[id];
			if(widget){
				const org = widget[type];
				/**
				 * Check if this widget has already the style. If not we exclude it.
				 * Otherwise we have Labels with background color and so on...
				 */
				let isIncluded = true;
				for(let key in props){
					if(ignoreStyles.indexOf(key) < 0 ){
						isIncluded = isIncluded &&  (org[key] !=null && org[key]!=undefined);
					}
				}
				if(isIncluded){
					const child = this.createWidgetPropertiesCommand(id, props, type);
					this.modelWidgetPropertiesUpdate(id, props, type);
					command.children.push(child);
				}
			}
		}
		this.addCommand(command);
		this.onModelChanged([]); 
		this.render();

		this.checkTemplateAutoUpdate(ids.map(id => {
			return {id: id, type:'widget', prop:'props', action:'change'}
		}))
		this.commitModelChange()
	}

	alignGroup (direction){
		this.logger.log(0,"alignGroup", "enter > " +direction);
		this.showError("Group Alignment not supported yet");
	}

	/**********************************************************************
	 * Theme Group add
	 **********************************************************************/

	addGroupByTheme (themedGroup, pos){
		this.logger.log(0,"addGroupByTheme", "enter > "+ themedGroup.id);
		this.startModelChange()
		pos = this.getUnZoomedBox(pos, this._canvas.getZoomFactor());


		/**
		 * 1) create multi command
		 */
		const command = {
			timestamp : new Date().getTime(),
			type : "MultiCommand",
			label : "AddGroupByTheme",
			children :[]
		};

		/**
		 * create new group
		 */
		const group ={
			id : "g"+this.getUUID(),
			children : [],
			name : themedGroup.name
		};

		/**
		 * 2) create child widgets
		 */
		const z = this.getMaxZValue(this.model.widgets);
		const children = themedGroup.children;
		for (let i=0; i< children.length; i++){
			/**
			 * we just assume the object was already cloned.
			 * we just give new id and set position
			 */
			const widget = children[i];

			widget.id = "w"+this.getUUID();
			widget.x +=  pos.x;
			widget.y +=  pos.y;
			widget.z = z + 1 + i;

			/**
			 * do not forget to add to group
			 */
			group.children.push(widget.id);

			let child = this._createAddWidgetCommand(widget);
			command.children.push(child);

			this.modelAddWidget(widget, true);
		}



		/**
		 * 3) add group
		 */
		let child = {
			timestamp : new Date().getTime(),
			type : "AddGroup",
			model : group
		};
		command.children.push(child);
		this.modelAddGroup(group, true);

		this.addCommand(command);

		this.onModelChanged([]);
		this.render();
		this.commitModelChange()
	}

	/**********************************************************************
	 * Template Group add
	 **********************************************************************/


	addGroupByTemplate (group, pos){
		this.logger.log(0,"addGroupByTemplate", "enter > "+ group.template);

		pos = this.getUnZoomedBox(pos, this._canvas.getZoomFactor());

		const groupTemplate = this.model.templates[group.template];
	
		if(groupTemplate){
			this.startModelChange()
			/**
			 * 1) create mutli command
			 */
			const command = {
				timestamp : new Date().getTime(),
				type : "MultiCommand",
				label : "AddGroupByTemplate",
				children :[]
			};

			/**
			 * 2) Group the main group
			 */
			group = this.factory.createTemplatedModel(groupTemplate);
			group.id = "tg"+this.getUUID();
			group.groups = []
			//group.templateChildren = []

			this.setRootTemplateIfNeeded(group, groupTemplate)

			const targetScreen = this.getHoverScreen(pos);
			if (targetScreen) {
				group.name = this.getGroupName(targetScreen.id, group.name)
			}

			/**
			 * 3) Since 4.0.60 we also create sub groups
			 */
			const [subgroups, template2Group] = this._addSubGroupByTemplate(groupTemplate, group, targetScreen)
	
			/**
			 * order templates by z
			 */
			let children = [];
			for(let i=0; i < group.children.length; i++){
				const id = group.children[i];
				const child = this.model.templates[id];
				children.push(child);
			}
			children = this.getOrderedWidgets(children);
			group.children=[];
		
			/**
			 * 4) create child widgets
			 */
			const z = this.getMaxZValue(this.model.widgets);
			for (let i=0; i< children.length; i++){
				const widgetTemplate = children[i];
				const widget = this.factory.createTemplatedModel(widgetTemplate);
				this.setRootTemplateIfNeeded(widget, widgetTemplate)
				widget.id = "w"+this.getUUID();
				widget.x +=  pos.x;
				widget.y +=  pos.y;
				widget.z = z + 1 + i;
				if (targetScreen) {
					widget.name = this.getGroupName(targetScreen.id, widgetTemplate.name)
				}

				const child = this._createAddWidgetCommand(widget);
				command.children.push(child);

				if (template2Group[widget.template]) {
					template2Group[widget.template].children.push(widget.id)
				} else {
					group.children.push(widget.id);
				}
				//group.templateChildren.push(widget.id)
				this.modelAddWidget(widget, true);
			}

			/**
			 * 5) add main group
			 */
			let child = {
				timestamp : new Date().getTime(),
				type : "AddGroup",
				model : group
			};
			command.children.push(child);
			this.modelAddGroup(group, true);
	
			/**
			 * 6) Add sub groups
			 */
			Object.values(subgroups).forEach(subgroup => {
				let child = {
					timestamp : new Date().getTime(),
					type : "AddGroup",
					model : subgroup
				};
				command.children.push(child);
				this.modelAddGroup(subgroup, true);
			})

		
			this.addCommand(command);

			this.onModelChanged([]);
			this.render();
			this.commitModelChange()
		}
	}

	_addSubGroupByTemplate (groupTemplate, group, targetScreen) {
		const subgroups = {}
		const template2Group = {}
		if (groupTemplate.groups) {
			// create sub groups if needed
			groupTemplate.groups.forEach(subGroupTemplate => {

				const subgroup = this.factory.createTemplatedGroup(subGroupTemplate);
				subgroup.children = []
				subgroup.groups = []
				subgroup.parent = subGroupTemplate.parent
				subgroup.id = "tg"+this.getUUID(); 
				this.setRootTemplateIfNeeded(subgroup, subGroupTemplate)
				if (targetScreen) {
					subgroup.name = this.getGroupName(targetScreen.id, subGroupTemplate.name)
				}

				subGroupTemplate.children.forEach(childTemplateId => {
					template2Group[childTemplateId] = subgroup
				})
				subgroups[subGroupTemplate.id] = subgroup
			})

			// sort hierachical to parents
			Object.values(subgroups).forEach(subgroup => {
				if (subgroup.parent && subgroups[subgroup.parent]) {
					subgroups[subgroup.parent].groups.push(subgroup.id)
				} else {
					group.groups.push(subgroup.id)
				}
				delete subgroup.parent
			})
		}
		return [subgroups, template2Group]
	}


	/**********************************************************************
	 * Group name
	 **********************************************************************/


	setGroupName (id, value){
		this.logger.log(2,"setGroupName", "enter ");

		if (value === '') {
			this.logger.warn("setGroupName", "exit > EMPTY name: " + id);
			return
		}

		if(this.model.groups && this.model.groups[id]){
			const group = this.model.groups[id];
			if(group.name != value){
				this.startModelChange()
				this.logger.log(4,"setGroupName", "enter " + id+ " " + value);
				var command = {
					timestamp : new Date().getTime(),
					type : "GroupName",
					o :group.name,
					n : value,
					modelId : id
				};
				this.addCommand(command);

				/**
				 * do the model update
				 */
				this.modelGroupName(id, value);
				this.commitModelChange(false, true)
			}

		} else {
			console.warn("setGroupName() > No group with id", id)
		}

	}

	modelGroupName (id, value){
		if(this.model.groups && this.model.groups[id]){
			var group = this.model.groups[id];
			group.name = value;

			if (this.model.templates && group.isRootTemplate) {
				const template = this.model.templates[group.template]
				if (template) {
					template.name = value
				}
			}

			this.onModelChanged([{type: 'group', action:"change", id: id}])
			this.onGroupNameChange(group)
		} else {
			console.warn("modelGroupName() > No group with id", id)
		}
	}


	undoGroupName (command){
		this.modelGroupName(command.modelId, command.o);
	}


	redoGroupName (command){
		this.modelGroupName(command.modelId, command.n);
	}

	/**********************************************************************
	 * Group add
	 **********************************************************************/

	addGroup (selection){
		this.logger.log(0,"addGroup", "enter ");

		this.startModelChange()
		/**
		 * Since 2.1.3 we have sub groups:
		 * Check that we do not have group of group!
		 */
		const subGroups = []
		const children = []
		for (let i = 0; i < selection.length; i++) {
			const widgetID = selection[i];
			/**
			 * We always take the top group!
			 */
			const group = this.getTopParentGroup(widgetID);
			if (group) {
				if (subGroups.indexOf(group.id) < 0) {
					subGroups.push(group.id)
				}
			} else {
				children.push(widgetID)
			}
		}
		const length = this.getObjectLength(this.model.groups);
		let name = "Group"
		if (length) {
			name += ' ' + length;
		}
		this.logger.log(-1,"addGroup", "add subgroups", subGroups);
		let group = {
			id : "g"+this.getUUID(),
			children : children,
			groups: subGroups,
			name : name
		};

		/**
		 * Since 4.2.5 we will move them all to consequtiv Z-Layers
		 */
		const [newZ, oldZ] = this.getGroupZChanges(selection)
	
		/**
		 * create the command
		 */
		const command = {
			timestamp : new Date().getTime(),
			type : "AddGroup",
			model : group,
			newZ: newZ,
			oldZ: oldZ
		};
		this.addCommand(command);

		this.modelAddGroup(group);
		this.modelWidgetLayers(newZ)

		// console.debug("Group.add() ", JSON.stringify(this.model.groups, null, 2))

		this.render();
		this.commitModelChange(false, true)

		this.showSuccess("Group was created!");

		return group;
	}

	getGroupZChanges (selection) {

		const widgets = this.model.widgets

		let maxZ = 0
		
		for (let i = 0; i < selection.length; i++) {
			const widgetID = selection[i];
			const widget = widgets[widgetID]
			if (widget) {
				maxZ = Math.max(maxZ, widget.z)
			}
		}

		const oldValues = this.getZValues(widgets);
		for (let i = 0; i < selection.length; i++) {
			const widgetID = selection[i];
			const offSet = maxZ - oldValues[widgetID]
			oldValues[widgetID] = maxZ - (offSet * 0.00001)
		}

		const newValues = this.getNormalizeWidgetZValues(oldValues);

		const newZ = {}
		const oldZ = {}
		for(let id in widgets){
			const z = newValues[id];
			const widget = widgets[id];
			if(widget && widget.z != z){
				oldZ[id] = widget.z;
				newZ[id] = z
			}
		}
		
		return [newZ, oldZ]
	}


	modelAddGroup (group, ignoreModelUpdate, line){

		if(!this.model.groups){
			this.model.groups = {};
		}

		this.model.groups[group.id] = group;
		if(line){
			this.model.lines[line.id] = line;
		}

		if(!ignoreModelUpdate){
			this.onModelChanged([{type: 'group', action:"change", id: group.id}])
		}
	}

	undoAddGroup (command){
		this.modelRemoveGroup(command.model);
		if (command.oldZ) {
			this.modelWidgetLayers(command.oldZ)
		}
		this.render();
	}

	redoAddGroup (command){
		this.modelAddGroup(command.model);
		if (command.newZ) {
			this.modelWidgetLayers(command.newZ)
		}
		this.render();
	}

	/**********************************************************************
	 * Group Remove
	 **********************************************************************/

	removeGroup (id){
		this.logger.log(1, "removeGroup", "enter >> " + id);

		if(this.model.groups && this.model.groups[id]) {
			this.startModelChange()
			var group = this.model.groups[id];
			var command = this.createRemoveGroupCommand(group);
			this.addCommand(command);
			this.unSelect();
			this.modelRemoveGroup(group, command.line);
			this.render();
			this.commitModelChange(false, true)
		} else {
			console.debug(this.model.groups);
			console.warn("Could not remove group with " , id);
		}
	}

	createRemoveGroupCommand (group){
		var command = {
			timestamp : new Date().getTime(),
			type : "RemoveGroup",
			model : group
		};
		var line = this.getLineFrom(group);
		if(line){
			command.line = line;
		}
		return command;
	}

	modelRemoveGroup (group, line, doNotCallModelChanged){
		var id = group.id;
		if (this.model.groups && this.model.groups[id]){
			delete this.model.groups[id];
			if (line){
				delete this.model.lines[line.id];
			}

			if(!doNotCallModelChanged){
				this.onModelChanged([{type: 'group', action:"change", id: id}])
			}

		} else {
			console.warn("Could not delete group:", this.model.groups);
			console.warn("Could not delete group: " + group.id, group);
		}
	}

	undoRemoveGroup (command){
		this.modelAddGroup(command.model, false, command.line);
		this.render();
	}

	redoRemoveGroup (command){
		this.modelRemoveGroup(command.model, command.line);
		this.render();
	}

	/**********************************************************************
	 * Delete Group and Widgets
	 **********************************************************************/

	getAllSubGroups (group, result = []) {
		if (group.groups) {
			group.groups.forEach(id => {
				let subGroup = this.model.groups[id]
				if (subGroup) {
					result.push(subGroup)
					this.getAllSubGroups(subGroup, result)
				}
			})
		}
		return result
	}

	removeGroupAndWidgets (id) {
		this.logger.log(-1, "removeGroupAndWidget", "enter > " + id);


		if(this.model.groups && this.model.groups[id]){
			this.startModelChange()
			const group = this.model.groups[id];

			const command = {
				timestamp : new Date().getTime(),
				type : "MultiCommand",
				label : "RemoveGroupAndWidget",
				children :[]
			};

			/**
			 * get all the children before we change the model
			 */
			const children = this.getAllGroupChildren(group)

			this.checkTemplateAutoUpdate([{id: id, type:'group', action:'remove'}])

			/**
			 * 1st) remove group se we have also the children list saved!
			 */
			const child = this.createRemoveGroupCommand(group);
			command.children.push(child);
			this.modelRemoveGroup(group, child.line, true);

			/**
			 * Since 2.1.3 we have subgroups. Delete them as well
			 */
			const subGroups = this.getAllSubGroups(group)
			subGroups.forEach(subGroup => {
				const subGroupChild = this.createRemoveGroupCommand(subGroup);
				command.children.push(subGroupChild);
				this.modelRemoveGroup(subGroup, subGroupChild.line, true);
			})

			/**
			 * 2) remove widgets. Clone children list as it might
			 * be modified in the modelRemoveWidgetAndLines() method.
			 *
			 * Since 2.1.3 we have subgroups.
			 * Get all the children before we execute the group removal
			 */

			for (let i=0; i < children.length; i++){
				let id = children[i];
				let child = this.createWidgetRemoveCommand(id);
				command.children.push(child);
				var widget = this.model.widgets[id];
				var lines = this.getLines(widget);
				var refs = this.getReferences(widget);
				this.modelRemoveWidgetAndLines(widget, lines, refs, true);
			}
			this.addCommand(command);
			this.unSelect();
			this.onModelChanged([]);
			this.render();
			this.commitModelChange(true, true)
		}
	}
}