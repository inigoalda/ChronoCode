package fr.epita.assistants.myide.presentation.rest.response;

import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.ProjectImpl;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@AllArgsConstructor
@NoArgsConstructor
public class FileResponse {
    public String title;
    public String content;
    public Language language;
    public String Path;

    public FileResponse(ProjectImpl project){
        this.title = project.getRootNode().getPath().getFileName().toString();
        try {
            this.content = new String(Files.readString(project.getRootNode().getPath(), StandardCharsets.ISO_8859_1));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        this.language = Language.java;
        this.Path = project.getRootNode().getPath().toString();
    }

    enum Language implements Node.Type {
        java,
    }
}
