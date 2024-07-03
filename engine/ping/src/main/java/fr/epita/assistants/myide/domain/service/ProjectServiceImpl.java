package fr.epita.assistants.myide.domain.service;

import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.presentation.rest.response.FileResponse;
import fr.epita.assistants.myide.presentation.rest.response.FolderResponse;
import fr.epita.assistants.myide.utils.Logger;
import lombok.Getter;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class ProjectServiceImpl implements ProjectService{

    @Getter
    public Project project;

    public Path indexFile;
    public Path tempFolder;

    public final NodeService nodeService = new NodeServiceImpl();

    public ProjectServiceImpl(Path i, Path t) {
        this.indexFile = i;
        this.tempFolder = t;
    }

    @Override
    public Project load(Path root) {
        this.project = new ProjectImpl(root);
        return this.project;
    }

    @Override
    public Feature.ExecutionReport execute(Project project, Feature.Type featureType, Object... params) {
        if (project == null){
            Logger.logError("No project loaded");
            return () -> false;
        }
        Optional<Feature> feat = project.getFeature(featureType);
        if (feat.isEmpty())
        {
            return () -> false;
        }
        Feature.ExecutionReport executionReport = feat.get().execute(project, params);
        if (!executionReport.isSuccess()){
            Logger.logError("Error on Feature " + featureType);
        }

        return executionReport;
    }

    public Optional<Feature.Type> getFeature(String feature)
    {
        try
        {
            return Optional.of(Mandatory.Features.Git.valueOf(feature));
        }
        catch (IllegalArgumentException e)
        {
            try
            {
                return Optional.of(Mandatory.Features.Maven.valueOf(feature));
            }
            catch (IllegalArgumentException f)
            {

                try
                {
                    return Optional.of(Mandatory.Features.Any.valueOf(feature));
                }
                catch (IllegalArgumentException ignored)
                {

                }
            }
        }
        return Optional.empty();
    }

    @Override
    public NodeService getNodeService() {
        return nodeService;
    }

    private Node getNode(Node node, Path path) {
        if (node.getPath().equals(path)) {
            return node;
        } else if (node.isFile()){
            return null;
        }
        for (Node n : node.getChildren()) {
            var tmp = getNode(n, path);
            if (tmp != null){
                return tmp;
            }
        }
        return null;
    }

    private Node create(Path file, Node.Types type) {
        if (project == null) {
            try {
                if (Files.exists(file))
                {
                    return null;
                }
                if (type == Node.Types.FILE) {

                    Files.createFile(file);
                } else {
                    Files.createDirectory(file);
                }
                this.project = new ProjectImpl(file);
                return this.project.getRootNode();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        if (!file.isAbsolute()){
            file = project.getRootNode().getPath().resolve(file);
        }
        var node = getNode(project.getRootNode(), file.getParent());
        if (node == null || node.isFile() || getNode(project.getRootNode(), file) != null) {
            return null;
        }
        try {
            return nodeService.create(node, file.getFileName().toString(), type);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean createFile(Path path, String content) {
        var node = create(path, Node.Types.FILE);
        if (node == null){
            RandomAccessFile file;
            try {
                file = new RandomAccessFile(path.toString(), "rw");
                file.setLength(0);
                file.write(content.getBytes(StandardCharsets.UTF_8));
                file.close();
            } catch (IOException e) {
                Logger.log(e.getMessage());
                return false;
            }
            Logger.logError("Overwrite existing file");
            return true;
        }
        RandomAccessFile file = null;
        try {
            file = new RandomAccessFile(node.getPath().toString(), "rw");
            file.setLength(0);
            file.write(content.getBytes(StandardCharsets.UTF_8));
            file.close();
        } catch (IOException e) {
            try {
                file.close();
            } catch (IOException ex) {
                Logger.logError(e.toString());
                return false;
            }
            Logger.logError(e.toString());
            return false;
        }
        return true;
    }

    public boolean createFolder(Path file) {
        return create(file, Node.Types.FOLDER) != null;
    }

    public boolean deleteFile(Path file) {
        if (project == null) {
            try {
                if (!Files.exists(file) || Files.isDirectory(file))
                {
                    return false;
                }
                Files.deleteIfExists(file);
                return true;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        if (file.equals(project.getRootNode().getPath())) {
            this.project = null;
            return true;
        }
        var node = (NodeImpl) getNode(project.getRootNode(), file);
        if (node == null || node.isFolder()) {
            Logger.logError("File does not exist");
            return false;
        }
        getNodeService().delete(node);
        node.getParent().removeChildren(node);
        return true;
    }

    public boolean deleteFolder(Path file) {
        if (project == null) {
            try {
                if (!Files.exists(file) || !Files.isDirectory(file))
                {
                    return false;
                }
                Files.walk(file)
                        .sorted(Comparator.reverseOrder())
                        .forEach(path -> {
                            try {
                                Files.deleteIfExists(path);
                            } catch (IOException e) {
                                System.err.println("Une erreur s'est produite en supprimant " + path + ": " + e.getMessage());
                            }
                        });
                return true;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        if (file.equals(project.getRootNode().getPath())) {
            this.project = null;
            return true;
        }
        var node = (NodeImpl) getNode(project.getRootNode(), file);
        if (node == null || node.isFile()) {
            Logger.logError("Folder does not exist");
            return false;
        }
        getNodeService().delete(node);
        node.getParent().removeChildren(node);
        return true;
    }

    public boolean move(Path src, Path dst) {
        if (project == null) {
            return false;
        }
        var srcNode = (NodeImpl)getNode(project.getRootNode(), src);
        if (src.equals(project.getRootNode().getPath())) {
            return false;
        }
        var dstNode = (NodeImpl)getNode(project.getRootNode(), dst);
        if (srcNode == null || dstNode == null || dstNode.isFile()) {
            return false;
        }
        try {
            getNodeService().move(srcNode, dstNode);
            dstNode.addChildren(srcNode);
            srcNode.getParent().removeChildren(srcNode);
            srcNode.setParent(dstNode);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean update(Path file, Integer from, Integer to, String content) {
        NodeImpl node = null;
        if (project == null) {
            try {
                if (!Files.exists(file) || Files.isDirectory(file))
                {
                    return false;
                }
                node = new NodeImpl(file);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        if (node == null) {
            node = (NodeImpl) getNode(project.getRootNode(), file);
        }
        if (node == null || node.isFolder()) {
            Logger.logError("Cannot update folder");
            return false;
        }
        try {
            nodeService.update(node, from, to, content.getBytes(StandardCharsets.UTF_8));
            return true;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
