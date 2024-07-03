package fr.epita.assistants.myide.presentation.rest.response;

import fr.epita.assistants.myide.domain.entity.Node;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class FolderResponse {

    public static class FileResponseOpti{
        public String title;
        public FileResponse.Language language;
        public String Path;

        public FileResponseOpti(String title, FileResponse.Language language, String path){
            this.title = title;
            this.language = language;
            this.Path = path;
        }
    }

    public String folderName;
    public List<FileResponseOpti> files;
    public List<FolderResponse> folders;

    public FolderResponse(Node root){
        this.folderName = root.getPath().getFileName().toString();
        this.files = new ArrayList<>();
        this.folders = new ArrayList<>();
        for (Node n : root.getChildren()){
            if (n.getType() == Node.Types.FOLDER){
                var newFolder = new FolderResponse(n);
                this.folders.add(newFolder);
            } else {
                this.files.add(new FileResponseOpti(n.getPath().getFileName().toString(),
                        FileResponse.Language.java,
                        n.getPath().toString()));
            }
        }
    }
}
