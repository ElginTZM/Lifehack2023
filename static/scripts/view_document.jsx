function ViewDocument(props) {
    const [textInput, setTextInput] = React.useState(props.text);
    const [title, setTitle] = React.useState(props.title);
    const [summary, setSummary] = React.useState(props.summary);

    function submit() {
        const formData = new FormData();
        formData.append('text-input', textInput);
        fetch("/summary", {
            method: "POST",
            headers: {
                "content-type": "multipart/form-data"
            },
            body: formData
        })
            .then(response => response.json())
            .then(response => {
                setSummary(response.summary);
                documentManager.addDocument(title, textInput, response.summary);
            });
    }

    return (
        <div className="view-document">
            <div className="original-text">
                <div className="top-bar">
                    <input type="text" placeholder="Title" className="title-input" value={title} onChange={(event) => {
                        setTitle(event.target.value);
                    }} />
                </div>
                <div className="text-content original-text-content">
                    <textarea placeholder="Input text here ..." className="original-text-input" value={textInput} onChange={(event) => {
                        setTextInput(event.target.value);
                    }}></textarea>
                    <div className="submit-text-div">
                        <button className="submit-text-btn" onClick={submit}>Summarise &gt;&gt;</button>
                    </div>
                </div>
            </div>
            <div className="summarised-text">
                <div className="top-bar">Summary</div>
                <div className="text-content">{summary}</div>
            </div>
        </div>
    );
}

const documentManager = {
    isNewDocument: true,
    documents: [],
    pageDOM: document.querySelector("#content-view-document"),
    container: null,
    documentIndex: 0,

    addDocument(title, text, summary) {
        const documentInfo = {
            title: title,
            text: text,
            summary: summary
        }
        if (this.isNewDocument) {
            this.documents.push(documentInfo);
            listingManager.addToListing(title, this.documents.length - 1);
            this.isNewDocument = false;
        } else {
            this.documents[this.documentIndex] = documentInfo;
            listingManager.changeListing(this.documentIndex, title);
        }
    },

    switchAway() {
        if (this.pageDOM.childElementCount > 0) {
            this.pageDOM.removeChild(this.container);
        }
    },

    newDocument(title='', text='', summary='Summary will appear here once you press submit.', createListing=false) {
        this.isNewDocument = true;
        this.documentIndex = this.documents.length;
        this.container = document.createElement('div');
        ReactDOM.render(<ViewDocument title={title} text={text} summary={summary} />, this.container);
        this.pageDOM.appendChild(this.container);
        if (createListing) {
            this.addDocument(title, text, summary);
        }
    },

    viewDocument(index) {
        this.isNewDocument = false;
        this.documentIndex = index;
        const documentInfo = this.documents[index];
        this.container = document.createElement('div');
        ReactDOM.render(<ViewDocument title={documentInfo.title} text={documentInfo.text} summary={documentInfo.summary}/>, this.container);
        this.pageDOM.appendChild(this.container);
    },

    viewCurrent() {
        if (this.documentIndex === this.documents.length) {
            this.newDocument();
        } else {
            this.viewDocument(this.documentIndex);
        }
    }
}