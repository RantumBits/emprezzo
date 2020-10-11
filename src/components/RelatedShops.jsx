import React from 'react'
import { includes, orderBy } from 'lodash'

export const getRelatedShops = (currentShop, allshops) => {

    const maxPosts = 3;
    const currentCategories = currentShop.category?currentShop.category.split(","):[];
    const currentTags = currentShop.tags?currentShop.tags.split(","):[];

    // console.log("******** in related shops")
    // console.log(allshops)
    // console.log(currentShop)
    // console.log(currentCategories)
    // console.log(currentTags)

    // Don't include the current post in posts list
    allshops = allshops.filter((post) => post.node.id !== currentShop.id);

    const identityMap = {};

    //Map over all posts, add to map and add points
    for (let post of allshops) {
        const id = post.node.id;
        if (!identityMap.hasOwnProperty(id)) {
            identityMap[id] = {
                shop: post,
                points: 0
            }
        }

        // For category matches, we add 2 points
        const categoryPoints = 2;
        const categories = post.node.category?post.node.category.split(","):[];
        categories.forEach((category) => {
            if (includes(...currentCategories, category)) {
                identityMap[id].points += categoryPoints;
            }
        })

        // For tags matches, we add 1 point
        const tagPoint = 1;
        const tags = post.node.tags?post.node.tags.split(","):[];
        tags.forEach((aTag) => {
            if (includes(currentTags, aTag)) {
                identityMap[id].points += tagPoint;
            }
        })

    }

    // Convert the identity map to an array
    const arrayIdentityMap = Object.keys(identityMap).map((id) => identityMap[id]);

    // Use a lodash utility function to sort them
    // by points, from greatest to least
    const similarPosts = orderBy(
        arrayIdentityMap, ['points'], ['desc']
    )

    //console.log("***** relatedShops Output ",similarPosts.splice(0, maxPosts))
    // return the max number posts requested
    return similarPosts.splice(0, maxPosts);

}
