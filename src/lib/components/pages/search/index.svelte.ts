interface ViewState {
	viewType: "map"|"list"
}

export const viewState: ViewState = $state({
	viewType: "map"
})
