package fr.epita.assistants.myide.domain.entity.any;

import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.domain.entity.report.SearchFeatureReport;
import fr.epita.assistants.myide.utils.Logger;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class SearchAnyFeature implements Feature {

    public List<SearchAnyFeatureHelp> l = new ArrayList<>();

    public SearchAnyFeature(){}

    private void searchInFile(Path filePath, String searchText, List<String> matchingLines, List<Node> nodesWithMatches) {
        try (Stream<String> lines = Files.lines(filePath)) {
            final int[] lineNumber = {0};
            lines.forEach(line -> {
                lineNumber[0]++;
                String lowerCaseLine = line.toLowerCase();
                String lowerCaseSearchText = searchText.toLowerCase();
                int index = lowerCaseLine.indexOf(lowerCaseSearchText);
                int linePosition = 0;
                while (index != -1) {
                    matchingLines.add(filePath + ": line " + lineNumber[0] + ", column " + (index + 1) + ", size " + searchText.length() + ": " + line);
                    try {
                        nodesWithMatches.add(new NodeImpl(filePath));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    l.add(new SearchAnyFeatureHelp("", filePath.getFileName().toString(), line, lineNumber[0], index + 1, filePath.toString()));
                    linePosition = index + searchText.length();
                    index = lowerCaseLine.indexOf(lowerCaseSearchText, linePosition);
                }
            });
        } catch (IOException e) {
            Logger.logError("Erreur lors de la lecture du fichier: " + filePath);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ExecutionReport execute(Project project, Object... params) {
        if (params.length < 1 || !(params[0] instanceof String searchText)) {
            Logger.logError("Le paramètre de recherche doit être une chaîne de caractères.");
            return new SearchFeatureReport(l, false);
        }
        File repoDir = project.getRootNode().getPath().toFile();

        try {
            List<String> matchingLines = new ArrayList<>();
            List<Node> nodesWithMatches = new ArrayList<>();
            Logger.log("Walking directory: " + repoDir.toPath());
            Files.walk(repoDir.toPath())
                    .filter(Files::isRegularFile)
                    .forEach(filePath -> {
                        Logger.log("Processing file: " + filePath);
                        searchInFile(filePath, searchText, matchingLines, nodesWithMatches);
                    });

            if (matchingLines.isEmpty()) {
                Logger.log("Aucune occurrence trouvée pour le texte recherché.");
                return new SearchFeatureReport(l, false);
            } else {
                matchingLines.forEach(Logger::log);
            }
            Logger.log("Recherche terminée.");

            return new SearchFeatureReport(l, true);
        } catch (IOException e) {
            Logger.logError("Une erreur d'I/O est survenue.");
            return new SearchFeatureReport(l, false);
        }
    }


    @Override
    public Type type() {
        return Mandatory.Features.Any.SEARCH;
    }
}
