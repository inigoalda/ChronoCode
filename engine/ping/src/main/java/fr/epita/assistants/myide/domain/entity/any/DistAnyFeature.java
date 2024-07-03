package fr.epita.assistants.myide.domain.entity.any;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;
import io.quarkus.logging.Log;

import java.io.*;
import java.nio.file.Path;
import java.util.Optional;
import java.util.zip.*;

public class DistAnyFeature implements Feature {

    public DistAnyFeature(){}

    @Override
    public ExecutionReport execute(Project project, Object... params) {
        Optional<Feature> feat = project.getFeature(Mandatory.Features.Any.CLEANUP);
        feat.get().execute(project);

        Path path = project.getRootNode().getPath();
        String archiveName = (path.getFileName() + ".zip");
        FileOutputStream fileOut;
        try {
            fileOut = new FileOutputStream(path.getParent().resolve(archiveName).toString());
            ZipOutputStream zipOut = new ZipOutputStream(fileOut);

            zipOut.putNextEntry(new ZipEntry(path.getFileName().toString() + "/"));
            zipOut.closeEntry();

            for (File childFile : path.toFile().listFiles()) {
                if (!childFile.getName().equals(archiveName)){
                    zipFile(childFile, path.getFileName().toString() + "/" + childFile.getName(), zipOut);
                }
            }

            zipOut.close();
            fileOut.close();

        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return () -> true;
    }

    private static void zipFile(File file, String path, ZipOutputStream zipOut) throws IOException {
        if (file.isDirectory()) {
            zipOut.putNextEntry(new ZipEntry(path + "/"));
            zipOut.closeEntry();

            for (File childFile : file.listFiles()) {
                zipFile(childFile, path + "/" + childFile.getName(), zipOut);
            }
            return;

        }

        FileInputStream fileIn = new FileInputStream(file);
        ZipEntry zipEntry = new ZipEntry(path);
        zipOut.putNextEntry(zipEntry);

        byte[] bytes = new byte[1024];
        int length;
        while ((length = fileIn.read(bytes)) >= 0) {
            zipOut.write(bytes, 0, length);
        }
        fileIn.close();
    }

    @Override
    public Type type() {
        return Mandatory.Features.Any.DIST;
    }
}
