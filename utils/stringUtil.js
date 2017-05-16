class StringUtil {

    getRepoName(gitLink) {
        var name = '';

        var pos = gitLink.indexOf('.git');
        name = gitLink.slice(0, pos);
        name = name.slice(name.lastIndexOf('/') + 1);

        return name;
    }
}

module.exports = new StringUtil();