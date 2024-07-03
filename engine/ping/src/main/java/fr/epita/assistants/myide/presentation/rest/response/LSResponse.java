package fr.epita.assistants.myide.presentation.rest.response;

import java.util.List;

public class LSResponse {
    public List<String> folders;
    public List<String> files;

    public LSResponse(List<String> Folders, List<String> Files) {
        this.folders = Folders;
        this.files = Files;
    }
}
