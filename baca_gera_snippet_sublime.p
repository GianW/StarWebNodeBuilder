 
DEF VAR nomeArq     AS CHAR NO-UNDO.
DEF VAR destino     AS CHAR NO-UNDO.
DEF VAR destinoAux  AS CHAR NO-UNDO.

DEF VAR vCont AS INT NO-UNDO.

destino = "C:\Users\giancarlo.winckler\Desktop\dbs_snippets\".

FOR EACH dbsdv._file NO-LOCK WHERE
         dbsdv._file._Hidden = NO AND
         dbsdv._file._Frozen = NO /*AND 
         dbsdv._file._file-name = "item"*/ : 

    destinoAux = destino + dbsdv._file._file-name.

    MESSAGE "Gerando arquivos para tabela: " + dbsdv._file._file-name.
    
    OS-CREATE-DIR VALUE(destinoAux).
    
    FOR EACH dbsdv._field use-index _field-position where
             dbsdv._field._file-recid = recid(dbsdv._file) no-lock:

        nomeArq = REPLACE(dbsdv._field._field-name, "-", "_") + ".sublime-snippet".
        OUTPUT TO value(destinoAux + "\" + nomeArq).

      /*
        DISP dbsdv._field._field-name dbsdv._field._Data-Type dbsdv._field._Initial dbsdv._field._Mandatory dbsdv._field._Format WITH 1 COLUMN.
        DISP "".*/                                  

        PUT UNFORMATTED '<snippet>' CHR(13) CHR(9) '<content><![CDATA[' dbsdv._file._file-name + '.' + _field._field-name ']]></content>' CHR(13).
        PUT UNFORMATTED CHR(9) '<tabTrigger>' dbsdv._file._file-name + '.' + _field._field-name '</tabTrigger>' CHR(13). 
        PUT UNFORMATTED CHR(9) '<description>' substring(dbsdv._field._Data-Type, 1, 4) ' ' replace(dbsdv._field._Format, '<', '') '</description>' CHR(13).
        PUT UNFORMATTED CHR(9) '<scope> source.abl, text.html.abl </scope>' CHR(13) '</snippet>'.

        OUTPUT CLOSE.
        
        vCont = vCont + 1.
    END.                                                           
END.

DISP "Foram gerados " + string(vCont) + "arquivos" FORMAT "x(30)" WITH FRAME f2 WIDTH 50.
