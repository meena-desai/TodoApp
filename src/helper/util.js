class Utils {
    static setLocal = (_list) => {
        return Promise.resolve(
            window.localStorage.setItem("todo_List", JSON.stringify(_list))
        );
    }

    static getLocal = () => {
        return Promise.resolve(JSON.parse(window.localStorage.getItem("todo_List")));
    }

    static random = () => {
        return Math.floor(Math.random() * 1000000) + ''
    }
}

export default Utils