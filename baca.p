/*
for each mob-uni-info where mob-uni-info.muf-cod = 13765 no-lock:
   for each mob-uni-info-item where mob-uni-info-item.muf-cod = mob-uni-info.muf-cod no-lock:

      disp mob-uni-info-item.muf-cod.

   end.
end.
*/
/*
for each dbsu.negociacaopeca where dbsu.negociacaopeca.npe-cod = 978300 no-lock:
   disp dbsu.NegociacaoPeca.npe-vlrtotalneg  dbsu.NegociacaoPeca.npe-vlrdesconto.
end.

for each dbsu.pedidopeca where dbsu.pedidopeca.ele-cod = 110009 no-lock:
   disp pedidopeca.pdp-cod npe-cod.
end.*/

FOR EACH dbsu.MotivoCancOs FIELDS(dbsu.MotivoCancOs.mcs-cod dbsu.MotivoCancOs.mcs-desc mcs-ativo)
                                 WHERE dbsu.MotivoCancOs.tps-cod = 1 NO-LOCK:
                                 disp mcs-desc mcs-ativo.
END.