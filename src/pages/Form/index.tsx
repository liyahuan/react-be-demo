export default function Search(){

    function searchRE(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const textinput = formData.get("textinput");
        alert(`you search for '${textinput}'`);
    }
    
    return(
        <form onSubmit={searchRE}>
            <label style={{marginRight: '12px', color:'white'}} htmlFor="searchinput">TestLabel ➡ </label>
            <input id="searchinput" name="textinput" />
            <button type="submit">Search</button>
        </form>
    )
}