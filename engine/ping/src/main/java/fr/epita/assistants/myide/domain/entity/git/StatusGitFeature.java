package fr.epita.assistants.myide.domain.entity.git;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.entity.report.GitFeatureReport;
import fr.epita.assistants.myide.utils.Logger;
import org.eclipse.jgit.api.AddCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.Status;
import org.eclipse.jgit.api.StatusCommand;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.NoFilepatternException;
import org.eclipse.jgit.errors.RepositoryNotFoundException;
import org.eclipse.jgit.util.FS;

import java.io.File;
import java.io.IOException;

public class StatusGitFeature implements Feature {

    public StatusGitFeature(){}

    @Override
    public GitFeatureReport execute(Project project, Object... params) {
        File repoDir = project.getRootNode().getPath().toFile();
        try (Git git = Git.open(repoDir, FS.DETECTED)){

            StatusCommand statusCommand = git.status();
            Status status = statusCommand.call();
            Logger.log("Status done on project");
            return new GitFeatureReport(status, true);
        } catch (RepositoryNotFoundException e) {
            Logger.logError("Le dépôt n'a pas été trouvé au chemin spécifié.");
        } catch (IOException e) {
            Logger.logError("Une erreur d'I/O est survenue.");
        } catch (NoFilepatternException e) {
            Logger.logError("Il faut au moins un fichier minimum a add.");
        } catch (GitAPIException e) {
            Logger.logError("Une erreur Git est survenue dans la commande Add.");
        }
        return new GitFeatureReport(null, false);
    }


    @Override
    public Type type() {
        return Mandatory.Features.Git.STATUS;
    }
}
