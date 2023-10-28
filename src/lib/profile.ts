interface ProfileProps {
    name: string,
    id: string
}


export const profile = (): ProfileProps => {
    const name = localStorage.getItem("name") as string;
    const id = localStorage.getItem("id") as string;

    return {
    name,
    id
    }
}
