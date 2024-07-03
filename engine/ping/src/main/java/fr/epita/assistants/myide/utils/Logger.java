package fr.epita.assistants.myide.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class Logger
{
    private static final String RESET_TEXT = "\u001B[0m";
    private static final String RED_TEXT = "\u001B[31m";

    private static String getDate()
    {
        return new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
    }

    public static void log(String message)
    {
        System.out.println("[" + getDate() + "] " + message);
    }

    public static void logError(String message)
    {
        System.err.println(RED_TEXT + "[" + getDate() + "] " + message + RESET_TEXT);
    }
}