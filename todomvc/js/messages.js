var Messages = (function () {

    return {
        get todoNew() { return "todo.new"; },
        get todoEdit() { return "todo.edit"; },
        get todoEditDone() { return "todo.editDone"; },
        get todoEditCancel() { return "todo.editCancel"; },
        get todoRemove() { return "todo.remove"; },
        get todoRemoveCompleted() { return "todo.removeCompleted"; },
        get todoToggle() { return "todo.toggle"; },
        get todoToggleAll() { return "todo.toggleAll"; },
        
        get viewShow() { return "view.show"; },
        get viewClear() { return "view.clear"; },
        get viewClearCompletedButton() { return "view.clearCompletedButton"; },
        get viewContentBlockVisibility() { return "view.contentBlockVisibility"; },
        get viewComplete() { return "view.complete"; },
        get viewEdit() { return "view.edit"; },
        get viewEditDone() { return "view.editDone"; },
        get viewRemove() { return "view.remove"; },
        get viewSetFilter() { return "view.setFilter"; },
        get viewToggleAll() { return "view.toggleAll"; },
        get viewUpdateStats() { return "view.updateStats"; },

        get end() { return "end"; }
    };
}());
