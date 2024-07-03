package fr.epita.assistants.myide.domain.entity.any;

import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.domain.entity.report.LSFeatureReport;
import fr.epita.assistants.myide.utils.Logger;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LSAnyFeature{

    public LSAnyFeature(){};

    public Feature.ExecutionReport execute(Object... params) {

        if (params.length < 1 || !(params[0] instanceof String path)) {
            Logger.logError("Le paramètre doit être une chaîne de caractères représentant le chemin.");
            return new LSFeatureReport(new ArrayList<>(), new ArrayList<>(), false);
        }

        File directory = new File(path);
        if (!directory.exists() || !directory.isDirectory()) {
            Logger.logError("Le chemin spécifié n'existe pas ou n'est pas un répertoire.");
            return new LSFeatureReport(new ArrayList<>(), new ArrayList<>(), false);
        }

        File[] filesAndFolders = directory.listFiles();
        if (filesAndFolders == null) {
            Logger.logError("Erreur lors de la lecture du répertoire.");
            return new LSFeatureReport(new ArrayList<>(), new ArrayList<>(), false);
        }

        List<String> folders = new ArrayList<>();
        List<String> files = new ArrayList<>();

        for (File file : filesAndFolders) {
            if (file.isDirectory()) {
                folders.add(file.getName());
            } else {
                files.add(file.getName());
            }
        }
        sortLists(folders);
        sortLists(files);
        return new LSFeatureReport(folders, files, true);
    }

    private void sortLists(List<String> files) {
        files.sort((s1, s2) -> {
            if (s1.startsWith(".") && !s2.startsWith(".")) {
                return -1;
            } else if (!s1.startsWith(".") && s2.startsWith(".")) {
                return 1;
            } else {
                return s1.compareTo(s2);
            }
        });
    }

    public Mandatory.Features.Any type() {
        return Mandatory.Features.Any.LS;
    }
}
