package fr.epita.assistants.myide.domain.entity.any;

public class SearchAnyFeatureHelp {

    public String key;
    public String title;
    public String content;
    public int line;
    public int position;
    public String path;

    SearchAnyFeatureHelp(String key, String title, String content, int line, int position, String path){
        this.key = key;
        this.title = title;
        this.position = position - 1;
        this.content = content;
        this.line = line;
        this.path = path;
    }
}
