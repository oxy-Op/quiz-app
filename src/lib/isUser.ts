export const isProfile = () => {
    const name = localStorage.getItem("name");
    const id = localStorage.getItem("id");

    if (name && id) {
        return {
            profile: {
                name,
                id
            }
        };
    }

    return false;
}