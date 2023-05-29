function ViewDocument(props) {
    const [textInput, setTextInput] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [summary, setSummary] = React.useState('Summary will appear here once you press submit.');

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
            .then(response => setSummary(response.summary));
    }

    return (
        <div className="view-document">
            <div className="original-text">
                <div className="top-bar">
                    <input type="text" placeholder="Title" className="title-input" onChange={(event) => {
                        setTitle(event.target.value);
                    }} />
                </div>
                <div className="text-content original-text-content">
                    <textarea placeholder="Input text here ..." className="original-text-input" onChange={(event) => {
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

const a = <ViewDocument new={false}/>;

function test() {
    console.log("test function");
}

ReactDOM.render(a, document.querySelector("#content-view-document"));
ReactDOM.render(a, document.querySelector("#content-view-document"));
ReactDOM.render(a, document.querySelector("#content-view-document"));