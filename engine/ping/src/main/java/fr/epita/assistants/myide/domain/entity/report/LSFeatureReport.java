package fr.epita.assistants.myide.domain.entity.report;


import fr.epita.assistants.myide.domain.entity.Feature;

import javax.validation.constraints.NotNull;
import java.util.List;

public record LSFeatureReport(@NotNull List<String> folders, @NotNull List<String> files, boolean isSuccess) implements Feature.ExecutionReport {
    public List<String> getFolders() {
        return folders;
    }

    public List<String> getFiles() {
        return files;
    }
}