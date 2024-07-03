package fr.epita.assistants.myide.domain.service;


import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.NodeImpl;
import fr.epita.assistants.myide.utils.Logger;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Files;
import java.util.Base64;

public class NodeServiceImpl implements NodeService {

    public NodeServiceImpl() {
    }

    @Override
    public Node update(Node node, int from, int to, byte[] insertedContent) {
        if (node.isFolder()) {
            throw new RuntimeException();
        }
        RandomAccessFile file = null;
        try {
            //StringBuilder text =  new StringBuilder(Files.readString(node.getPath()));
            //text.delete(from, to);
            //text.insert(from, new String(insertedContent, StandardCharsets.UTF_8));
            String text = new String(insertedContent, StandardCharsets.UTF_8);

            file = new RandomAccessFile(node.getPath().toString(), "rw");
            file.setLength(0);
            file.write(text.toString().getBytes(StandardCharsets.UTF_8));
            file.close();
            return node;
        } catch (IOException e) {
            try {
                file.close();
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean delete(Node node) {
        if (node.isFolder()){
            for (Node f : node.getChildren()){
                delete(f); // maybe check if children nodes are right
            }
        }
        try {
            Files.deleteIfExists(node.getPath());
        } catch (IOException e) {
            return false;
        }
        return true;
    }

    @Override
    public Node create(Node folder, String name, Node.Type type) {
        Path file = folder.getPath().resolve(Path.of(name));
        try {
            if (type == Node.Types.FILE) {
                Files.createFile(file);
            } else {
                Files.createDirectory(file);
            }
            var res = new NodeImpl(file, (NodeImpl) folder);
            ((NodeImpl) folder).addChildren(res);
            return res;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Node move(Node nodeToMove, Node destinationFolder) {
        try {
            Path finalDst = destinationFolder.getPath().resolve(nodeToMove.getPath().getFileName());
            Files.move(nodeToMove.getPath(), finalDst);
            ((NodeImpl)nodeToMove).setPath(finalDst);
            return nodeToMove;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
