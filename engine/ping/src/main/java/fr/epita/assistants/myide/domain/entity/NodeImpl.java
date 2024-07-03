package fr.epita.assistants.myide.domain.entity;

import fr.epita.assistants.myide.utils.Logger;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Getter
public class NodeImpl implements Node{

    @Setter
    private Path path;

    private Type type;

    @Setter
    private NodeImpl parent = null;

    private List<@NotNull Node> children;

    public NodeImpl(Path path) throws Exception {
        this.path = path;

        File file = new File(String.valueOf(path));
        this.children = new ArrayList<>();
        if (!file.exists())
        {
            Logger.logError("File does not exist");
            throw new Exception("Not a valid file");
        }
        if(file.isDirectory())
        {
            type = Types.FOLDER;
            File[] files = file.listFiles();
            if (files != null) {
                for (File f : files) {
                    children.add(new NodeImpl(Path.of(f.getPath()), this));
                }
            }
        }
        else
        {
            type = Types.FILE;
        }
    }

    public NodeImpl(Path path, NodeImpl parent) throws Exception {
        this.parent = parent;
        this.path = path;

        File file = new File(String.valueOf(path));
        this.children = new ArrayList<>();
        if (!file.exists())
        {
            throw new Exception("Not a valid file");
        }
        if(file.isDirectory())
        {
            type = Types.FOLDER;
            File[] files = file.listFiles();
            if (files != null) {
                for (File f : files) {
                    children.add(new NodeImpl(Path.of(f.getPath()), this));
                }
            }
        }
        else
        {
            type = Types.FILE;
        }
    }

    public boolean removeChildren(Node node)
    {
        return children.remove(node);
    }

    public boolean addChildren(Node node)
    {
        return children.add(node);
    }

}
