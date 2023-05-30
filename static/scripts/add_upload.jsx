function UploadListing(props) {
    function redirect() {
        documentManager.viewDocument(props.index);
        switchTab(1);
    }

    return (
        <div className="upload-listing" onClick={redirect}>
            <div className="upload-title">{props.title}</div>
            <div className="arrow">
                <svg height="10" width="5">
                    <line x1="0" y1="0" x2="5" y2="5" />
                    <line x1="5" y1="5" x2="0" y2="10" />
                </svg>
            </div>
        </div>
    )
}

const listingManager = {
    listingsDOM: document.querySelector("#summary-listing"),

    addToListing(title, index) {
        const container = document.createElement('div');
        ReactDOM.render(<UploadListing title={title} index={index}/>, container);
        this.listingsDOM.appendChild(container);
    },

    changeListing(index, newTitle) {
        this.listingsDOM.removeChild(this.listingsDOM.children[index]);
        const container = document.createElement('div');
        ReactDOM.render(<UploadListing title={newTitle} index={index}/>, container);
        if (index === this.listingsDOM.childElementCount) {
            this.listingsDOM.appendChild(container);
        } else {
            this.listingsDOM.insertBefore(container, this.listingsDOM.children[index]);
        }
    }
}