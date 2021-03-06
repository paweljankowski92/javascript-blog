'use strict';

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorLinkRight: Handlebars.compile(document.querySelector('#template-author-right-link').innerHTML),
}

const opts = {
    tagSizes: {
        count: 5,
        classPrefix: 'tag-size-',
    },
};

const select = {
    all: {
        articles: '.post',
        linksTo: {
            tags: 'a[href^="#tag-"]',
            authors: 'a[href^="#author-"]',
        },
    },
    article: {
        tags: '.post-tags .list',
        author: '.post-author',
    },
    listOf: {
        titles: '.titles',
        tags: '.tags.list',
        authors: '.authors.list',
    },
};

function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
    console.log(event);


    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }
    /*  add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href')
    console.log(articleSelector)

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector)
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
}



// Moduł 5.4

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post .post-author',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = '5',
    optCloudClassPrefix = 'tag-size-',
    optAuthorsListSeletor = '.authors.list'

function generateTitleLinks(customSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for (let article of articles) {

        /* get the article id */
        const articleId = article.getAttribute('id');

        /* find the title element */
        /* get the title from the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;

        /* create HTML of the link */
        const linkHTMLData = {
            id: articleId,
            title: articleTitle
        };
        const linkHTML = templates.articleLink(linkHTMLData);
        /* insert link into titleList */
        html = html + linkHTML;
    }

    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    console.log(links)

    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }

}
generateTitleLinks();


//Moduł 6

function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
    return classNumber;
}

function generateTags() {
    /* create a new variable allTags with an empty object*/
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {

        /* find tags wrapper */
        const titleList = article.querySelector(optArticleTagsSelector);

        /* make html variable with empty string */
        let html = '';

        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');
        console.log(articleTags);

        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
        console.log(articleTagsArray);

        /* START LOOP: for each tag */
        for (let tag of articleTagsArray) {
            console.log(tag);

            /* generate HTML of the link */
            const linkHTMLData = {
                id: tag
            };
            const linkHTML = templates.tagLink(linkHTMLData);
            console.log(linkHTML);
            /* add generated code to html variable */
            html = html + linkHTML;
            console.log(html);

            /*check if this link is NOT already in allTags*/
            if (!allTags.hasOwnProperty(tag)) {
                /*add generated code to allTags object */
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }
        }
        /* END LOOP: for each tag */

        /* insert HTML of all the links into the tags wrapper */
        titleList.innerHTML = html;
        /* END LOOP: for every article: */
    }
    /* find list of tags in right column*/
    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);
    /*[NEW] create variable for all links HTML code */
    const allTagsData = {
        tags: []
    };

    /*[NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
        /*[NEW] generate code of a link and add it to allTagsHTML */
        // const tagLinkHTML = '<li><a class="tag-size-' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a>, </li>';
        // <li><a class="tag-size-{{ count }}" href="#tag-{{ tag }}">{{ tag }}</a></li>
        const tagLinkHTMLData = {
            className: calculateTagClass(allTags[tag], tagsParams),
            tag: tag
        };
        const tagLinkHTML = templates.tagCloudLink(tagLinkHTMLData);
        console.log('tagLinkHTML:', tagLinkHTML);
        allTagsData.tags.push({
            tag: tag,
            count: allTags[tag],
            className: calculateTagClass(allTags[tag], tagsParams)
        });
        /* [NEW] END LOOP: for each tag in allTags: */
    }


    /* [NEW] add html from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData)
}

function calculateTagsParams(tags) {
    const params = {
        max: 0,
        min: 999999,
    };

    console.log(params);
    for (let tag in tags) {
        console.log(tag + ' is used ' + tags[tag] + ' times');
        if (tags[tag] > params.max) {
            params.max = tags[tag];
        }
        if (tags[tag] < params.min) {
            params.min = tags[tag];
        }
    }

    return params;
}

generateTags();


function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    console.log(activeLinks);
    /* START LOOP: for each active tag link */
    for (let tag of activeLinks) {
        /* remove class active */
        tag.classList.remove('active');
        /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const links = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let link of links) {
        /* add class active */
        link.classList.add('active');
        /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
    /* find all links to tags */
    const links = document.querySelectorAll('a[href^="#tag-"]');
    console.log(links);
    /* START LOOP: for each link */
    for (let link of links) {
        /* add tagClickHandler as event listener for that link */
        link.addEventListener('click', tagClickHandler);
        /* END LOOP: for each link */
    }
}
addClickListenersToTags();


// AUTHORS

function generateAuthors() {

    let allAuthors = {};

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {

        /* find authors wrapper */
        const authorwrapper = article.querySelector(optArticleAuthorSelector);

        /* get authors from data-authors attribute */
        const articleAuthor = article.getAttribute('data-author');

        /* generate HTML of the link */
        const linkHTMLData = {
            title: articleAuthor
        };
        const linkHTML = templates.authorLink(linkHTMLData);

        if (!allAuthors.hasOwnProperty(articleAuthor)) {
            /* [NEW] add generated code to allAuthors array */
            allAuthors[articleAuthor] = 1;
        } else {
            allAuthors[articleAuthor]++;
        }
        /* insert HTML of all the links into the author wrapper */
        authorwrapper.innerHTML = linkHTML;
        /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const articleList = document.querySelector('.authors');
    // create variable for all links HTML code
    const allAuthorsData = {
        tags: []
    };
    // Start loop for each article in allAuthors
    for (let articleAuthor in allAuthors) {

        // generate code of a link and add it to allTagsHTML
        // allAuthorsHTML += '<li><a href="#author-' + articleAuthor + '"">' + articleAuthor + ' (' + allAuthors[articleAuthor] + ')</a>. <li>';
        const allAuthorsHTMLData = {
            id: articleAuthor,
            title: allAuthors[articleAuthor]
        };
        const allAuthorsHTML = templates.authorLinkRight(allAuthorsHTMLData);
        allAuthorsData.tags.push({
            id: articleAuthor,
            title: allAuthors[articleAuthor],
        });
    }

    articleList.innerHTML = templates.authorLinkRight(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-', '');

    /* find all author links with class active */
    const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');

    /* START LOOP: for each active tag link */
    for (let author of activeLinks) {
        /* remove class active */
        author.classList.remove('active');
        /* END LOOP: for each active tag link */
    }
    /* find all author links with "href" attribute equal to the "href" constant */
    const links = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let link of links) {
        /* add class active */
        link.classList.add('active');
        /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {

    /* find all links to authors */
    const links = document.querySelectorAll('a[href^="#author-"]');

    /* START LOOP: for each link */
    for (let link of links) {

        /* add authorClickHandler as event listener for that link */
        link.addEventListener('click', authorClickHandler);
        /* END LOOP: for each link */
    }
}
addClickListenersToAuthors();
