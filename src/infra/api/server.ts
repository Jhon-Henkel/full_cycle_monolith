import {app} from "./express"

const PORT = 3000

app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`App running on port ${PORT}`)
})