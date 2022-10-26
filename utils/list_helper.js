const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.length === 0 ? 0 : blogs.map(blog => blog.likes).reduce((currentValue, nextItem) => currentValue+nextItem, 0)
    return likes
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog =>blog.likes)
    //console.log('array of likes', likes)
    const maxLike = Math.max(...likes)
    //console.log('max like', maxLike)
    const blog = blogs.length === 0 ? 0 : blogs.find(blog => blog.likes === maxLike )
    return blog === 0?null: {
        "title": blog.title,
        "author": blog.author,
        "likes": blog.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}

