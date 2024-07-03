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

public class AddGitFeature implements Feature {

    public AddGitFeature(){}

    @Override
    public GitFeatureReport execute(Project project, Object... params) {
        File repoDir = project.getRootNode().getPath().toFile();
        try (Git git = Git.open(repoDir, FS.DETECTED)){

            AddCommand addGit = git.add();
            StatusCommand statusCommand = git.status();
            for (Object p: params)
            {
                try {
                    boolean fileExists = new File( repoDir, (String) p).isFile();
                    boolean DirExists = new File( repoDir, (String) p).isDirectory();
                    if (!fileExists && !DirExists)
                    {
                        Logger.logError("Unknown file : " + (String) p);
                        return new GitFeatureReport(null, false);
                    }
                    addGit.addFilepattern((String)p);
                }
                catch(ClassCastException e)
                {
                    Logger.logError("Params not string");
                }
            }
            addGit.call();

            Logger.log("Add done on project");
            Status status = statusCommand.call();
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
        return Mandatory.Features.Git.ADD;
    }
}
