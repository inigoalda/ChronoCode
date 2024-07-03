package fr.epita.assistants.myide.domain.entity.any;

import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.utils.Logger;
import io.quarkus.logging.Log;
import lombok.SneakyThrows;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

public class CleanupAnyFeature implements Feature {

    public CleanupAnyFeature() {
    }

    private void deleteFile(NodeImpl fileNode) {
            if (fileNode.isFolder()) {
                var children = fileNode.getChildren();

                if (children != null) {
                    for (var childNode : children) {
                        deleteFile((NodeImpl) childNode);
                    }
                }
            }
        fileNode.getPath().toFile().delete();
    }

    private void findAndDelete(NodeImpl fileNode, List<String> targets){
        if (targets.contains(fileNode.getPath().getFileName().toString())){
            deleteFile(fileNode);
        } else {
            if (fileNode.isFolder()) {
                var children = fileNode.getChildren();

                for (var childNode : children) {
                    findAndDelete((NodeImpl) childNode, targets);
                }
            }
        }
    }

    @Override
    public ExecutionReport execute(final Project project, final Object... params) {
        File repoDir = project.getRootNode().getPath().toFile();

        if (!repoDir.exists()) return () -> true;

        // Adds files to ignore from any '.myideignore' file.
        File[] repoDirFiles = repoDir.listFiles();

        if (null == repoDirFiles) return () -> true;

        NodeImpl myideignore = null;
        for (Node child : project.getRootNode().getChildren()){
            if (child.getPath().getFileName().toString().equals(".myideignore")){
                myideignore = (NodeImpl)child;
            }
        }
        if (myideignore == null){
            return () -> true;
        }

        try {
            findAndDelete((NodeImpl)project.getRootNode(), Files.readAllLines(myideignore.getPath()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return () -> true;
    }

    @Override
    public Type type() {
        return Mandatory.Features.Any.CLEANUP;
    }
}
