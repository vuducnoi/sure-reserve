const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || 'Hj78JgfmS'
const MONGODB_USER = process.env.MONGODB_USER || 'admin'
const MONGODB_HOST = process.env.MONGODB_HOST || 'cluster0-ya3an.mongodb.net'
const MONGODB_OPTIONS = process.env.MONGODB_OPTIONS || 'retryWrites=true&w=majority'
const MONGODB_DB = process.env.MONGODB_DB || 'sure-reserve'
export default {
    MONGODB_URI: `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DB}?${MONGODB_OPTIONS}`
}