const races = [
  {
    key: "-LWemsxRjzNRrQBqT34z",
    category: "toertocht",
    date: "2019-01-06T00:00:00.000Z",
    name: "TT vlodrop"
  },
  {
    key: "-LXA3NacvzbsZmwotNIE",
    category: "offRoadRegional",
    date: "2019-01-06T00:00:00.000Z",
    name: "KNWU Noord ICW KNWU Noord ICW Veendam"
  },
  {
    key: "-LYM6B3crygrF7HOAUmN",
    category: "trainingskoers",
    date: "2019-02-09T00:00:00.000Z",
    name: "Zaterdagkoers ahoy"
  },
  {
    key: "-LYRfyGBEpSpYkHfiSVk",
    category: "toertocht",
    date: "2019-02-03T00:00:00.000Z",
    name: "Winterfiets Elfstedentocht"
  },
  {
    key: "-LY_gqS1FQUdd7FRsgrl",
    category: "trainingskoers",
    date: "2019-02-10T00:00:00.000Z",
    name: "Trainingskoers Spartaan"
  },
  {
    key: "-LYuSvhz3069OIpzeCsK",
    category: "trainingskoers",
    date: "2019-02-16T00:00:00.000Z",
    name: "Zaterdagkoers Ahoy"
  },
  {
    key: "-LYvi1t40oyGrgmCbUtQ",
    category: "CK",
    date: "2019-02-17T00:00:00.000Z",
    name: "CK Cross"
  },
  {
    key: "-LZPiIME0jv9igaTECxw",
    category: "trainingskoers",
    date: "2019-02-23T00:00:00.000Z",
    name: "Zaterdagkoers Ahoy"
  },
  {
    key: "-LZVl9T-sKSGXPFYpcHx",
    category: "zomoco",
    date: "2019-02-24T00:00:00.000Z",
    name: "Kampioenschap van Groene Hart"
  },
  {
    key: "-LZuRhg_i2tgKeMcuWql",
    category: "trainingskoers",
    date: "2019-02-24T00:00:00.000Z",
    name: "Tom dumoulin park"
  },
  {
    key: "-L_MZPmXAOsq2mVcXRo-",
    category: "trainingskoers",
    date: "2019-03-02T00:00:00.000Z",
    name: "Trainingskoers Ahoy"
  },
  {
    key: "-L_MZjJY8WWgrXSxxCX7",
    category: "CK",
    date: "2019-03-03T00:00:00.000Z",
    name: "Haags Kampioenschap"
  },
  {
    key: "-L_Xw0FvlVNw5Gxweijp",
    category: "trainingskoers",
    date: "2019-03-09T00:00:00.000Z",
    name: "trainingskoers ahoy"
  },
  {
    key: "-Laf1iSkOlBv8W7gNAZo",
    category: "toertocht",
    date: "2019-03-23T00:00:00.000Z",
    name: "Joop Zoetemelk Classic"
  },
  {
    key: "-LalM3zlJz20XiLXGVTm",
    category: "offRoadNational",
    date: "2019-03-24T00:00:00.000Z",
    name: "GP Kivada"
  },
  {
    key: "-LalO5qpGrNtuVV17LJg",
    category: "studentencup",
    date: "2019-03-24T00:00:00.000Z",
    name: "studentencup Delft"
  },
  {
    key: "-LbE8uWqm6t2RdrwwSt6",
    category: "zomoco",
    date: "2019-03-30T00:00:00.000Z",
    name: "Open Rotterdams Kampioenschap"
  },
  {
    key: "-LbK0Deyoj8ILV8AnBSQ",
    category: "toertocht",
    date: "2019-03-31T00:00:00.000Z",
    name: "Kreders Klassieker"
  },
  {
    key: "-LbKLdIXBmxcSdZlUoMh",
    category: "zomoco",
    date: "2019-03-31T00:00:00.000Z",
    name: "ZoMoCo WTOS"
  },
  {
    key: "-LbiEJdPKbQrYU0Wpcsb",
    category: "trainingskoers",
    date: "2019-02-17T00:00:00.000Z",
    name: "Trainingskoers Spartaan"
  },
  {
    key: "-LboND6zit-Dpzo4A_JH",
    category: "criterium",
    date: "2019-04-06T00:00:00.000Z",
    name: "NHC - Grote Handbike"
  },
  {
    key: "-LbsA_0VapQIQoEziiQi",
    category: "studentencup",
    date: "2019-04-06T00:00:00.000Z",
    name: "Studentencup Wageningen"
  },
  {
    key: "-LbtdE2H_t1E5UvLd782",
    category: "omloop",
    date: "2019-04-06T00:00:00.000Z",
    name: "Ster Omloop Nieuwland"
  },
  {
    key: "-LbwgtW-3vvyv-QYEl7L",
    category: "omloop",
    date: "2019-04-07T00:00:00.000Z",
    name: "Slag om Westerland"
  },
  {
    key: "-LcD7-zm-89fK27lc8R8",
    category: "trainingskoers",
    date: "2019-04-02T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LcD7E8ib0XuDNSp13KJ",
    category: "trainingskoers",
    date: "2019-04-09T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LcQVB07JSszLmXrbgTO",
    category: "trainingskoers",
    date: "2019-02-16T00:00:00.000Z",
    name: "Voorjaarskoers De Mol "
  },
  {
    key: "-LcQVVe3Mfc5MoU2zJ-a",
    category: "trainingskoers",
    date: "2019-02-17T00:00:00.000Z",
    name: "Voorjaarskoers Spartaan"
  },
  {
    key: "-LcQVqtnCw-ei43Cwyzd",
    category: "omloop",
    date: "2019-03-16T00:00:00.000Z",
    name: "Hegau Cup #1"
  },
  {
    key: "-LcRbqZFf91NliGv1StO",
    category: "omloop",
    date: "2019-04-13T00:00:00.000Z",
    name: "Omloop van het Munnikenland"
  },
  {
    key: "-LcRvu_cZpEnqHdwJaZY",
    category: "criterium",
    date: "2019-04-14T00:00:00.000Z",
    name: "Ronde van Oud-Gastel"
  },
  {
    key: "-LcRxQsZUy16BPXO7dZ3",
    category: "criterium",
    date: "2019-03-31T00:00:00.000Z",
    name: "Ronde van Heeswijk-Dinther"
  },
  {
    key: "-LcS5zswJWPamH1bmUzt",
    category: "criterium",
    date: "2019-03-16T00:00:00.000Z",
    name: "Ronde van Oud-Vossemeer"
  },
  {
    key: "-LcSMsK25geB8EXXRsX5",
    category: "toertocht",
    date: "2019-04-14T00:00:00.000Z",
    name: "Ronde van Arnhem"
  },
  {
    key: "-Lc_aYgbEkOyLAwmdz7N",
    category: "zomoco",
    date: "2019-04-07T00:00:00.000Z",
    name: "ZoMoCo De Mol"
  },
  {
    key: "-LcbxM4WfHW-Ot7Hs_AO",
    category: "trainingskoers",
    date: "2019-04-16T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LcbxvIJaithk86NthdT",
    category: "criterium",
    date: "2019-04-13T00:00:00.000Z",
    name: "Criterium sHeer Abtskerke"
  },
  {
    key: "-Lcg17Hw8bsVXJAu81mA",
    category: "zomoco",
    date: "2019-04-14T00:00:00.000Z",
    name: "ZoMoCo Trias"
  },
  {
    key: "-LcgGDkIzenb-1TMsoDB",
    category: "zomoco",
    date: "2019-04-17T00:00:00.000Z",
    name: "GP Koppert"
  },
  {
    key: "-LckytjWLIXsGSAkub8n",
    category: "criterium",
    date: "2019-04-14T00:00:00.000Z",
    name: "Ronde van Breezand"
  },
  {
    key: "-Ld48eAieeB4HV9iqDmJ",
    category: "criterium",
    date: "2019-04-22T00:00:00.000Z",
    name: "Ronde van Werkendam"
  },
  {
    key: "-Ld4V6anXP6H3CmXVKS5",
    category: "criterium",
    date: "2019-04-22T00:00:00.000Z",
    name: "Ronde van Waddinxveen"
  },
  {
    key: "-LdEwalc8cXOnUai3hCM",
    category: "toertocht",
    date: "2019-04-20T00:00:00.000Z",
    name: "Amstel Gold Race"
  },
  {
    key: "-LdLDnYI5VcV2wUQ-aIV",
    category: "trainingskoers",
    date: "2019-04-23T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LdLFgAe9Ha5SE0ypHBA",
    category: "wtos",
    date: "2019-04-23T00:00:00.000Z",
    name: "WTOS 10km TT April"
  },
  {
    key: "-LdUDuiZde8GL9WWrMMJ",
    category: "criterium",
    date: "2019-04-27T00:00:00.000Z",
    name: "Ronde van 's-Gravendeel"
  },
  {
    key: "-LdYgPMeVMvFkvjk6UQf",
    category: "toertocht",
    date: "2019-04-28T00:00:00.000Z",
    name: "Dreamplafonds Voorjaarstocht"
  },
  {
    key: "-LdZHHviygJI8KCbhDOQ",
    category: "criterium",
    date: "2019-04-28T00:00:00.000Z",
    name: "Haagse wielerdag"
  },
  {
    key: "-LdZwEvjLQEfrFw81JHF",
    category: "offRoadNational",
    date: "2019-04-28T00:00:00.000Z",
    name: "Koningscup Havelte"
  },
  {
    key: "-Ldo6sLbytIHTicv6ZLn",
    category: "trainingskoers",
    date: "2019-04-30T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LdojMkWhuGtL6hJcwPl",
    category: "cyclosportive",
    date: "2019-03-24T00:00:00.000Z",
    name: "Gran Fondo del Po"
  },
  {
    key: "-LdokowY4S3S_BoFkpma",
    category: "cyclosportive",
    date: "2019-04-28T00:00:00.000Z",
    name: "Gran Fondo Dieci Colli"
  },
  {
    key: "-LdsAG7uQY_72KmgrTtg",
    category: "wtos",
    date: "2019-05-01T00:00:00.000Z",
    name: "La Una "
  },
  {
    key: "-Le6ldhwBhrs-LRY9Eas",
    category: "zomoco",
    date: "2019-05-05T00:00:00.000Z",
    name: "ZoMoCo Ahoy"
  },
  {
    key: "-LeBSmYAgHriJBRlVLi0",
    category: "criterium",
    date: "2019-05-05T00:00:00.000Z",
    name: "Bevrijdingsronde Rijswijk"
  },
  {
    key: "-LeC-KZgHRw1QBu_vlVR",
    category: "offRoadRegional",
    date: "2019-05-04T00:00:00.000Z",
    name: "MTB Cup ZH Trias"
  },
  {
    key: "-LeLeUWe7YIYweK_SiWy",
    category: "trainingskoers",
    date: "2019-05-07T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LeYLt3ghwJcpdhWdVFl",
    category: "criterium",
    date: "2019-04-17T00:00:00.000Z",
    name: "GP Coppert"
  },
  {
    key: "-LeYMnaAOqZQOufUC8O6",
    category: "criterium",
    date: "2019-05-05T00:00:00.000Z",
    name: "Ronde van Amstelveen"
  },
  {
    key: "-LebpgMn94wSp2SAYdzP",
    category: "criterium",
    date: "2019-05-11T00:00:00.000Z",
    name: "de Draai Rond de Kraai"
  },
  {
    key: "-LeemX6Vq9cu7t0Z-cKM",
    category: "toertocht",
    date: "2019-05-11T00:00:00.000Z",
    name: "Oude Maastocht"
  },
  {
    key: "-LefnOIUrwup0-6DpMWa",
    category: "zomoco",
    date: "2019-05-12T00:00:00.000Z",
    name: "ZoMoCo Trias"
  },
  {
    key: "-LehRWSkg4PsDReRVMef",
    category: "studentencup",
    date: "2019-05-12T00:00:00.000Z",
    name: "Ronde van Wolder"
  },
  {
    key: "-LenOu_2kEJv7eDYlnRn",
    category: "toertocht",
    date: "2019-05-11T00:00:00.000Z",
    name: "Classico Boretti"
  },
  {
    key: "-LewxykrCVi8wBgxEPNw",
    category: "timetrial",
    date: "2019-05-13T00:00:00.000Z",
    name: "Joop Kuiper Tijdrit Oostwold"
  },
  {
    key: "-Lf0QsnbgvnwJCbwMAq6",
    category: "wtos",
    date: "2019-05-15T00:00:00.000Z",
    name: "CK Omnium"
  },
  {
    key: "-LfGiIPkbc09sgBDU5qf",
    category: "criterium",
    date: "2019-05-19T00:00:00.000Z",
    name: "de Wiek op Wiel'n"
  },
  {
    key: "-LfJNJOxH5QmtHumKUFg",
    category: "timetrial",
    date: "2019-05-17T00:00:00.000Z",
    name: "Hel van Petten TT"
  },
  {
    key: "-LfJNZ3VsU7KV3V4hkYc",
    category: "omloop",
    date: "2019-05-18T00:00:00.000Z",
    name: "Hel van Petten Omloop"
  },
  {
    key: "-LfJNoMEx4jhabc3WDj7",
    category: "criterium",
    date: "2019-05-19T00:00:00.000Z",
    name: "Hel van Petten Criterium"
  },
  {
    key: "-LfWSh0dKNxpNUB9n5_y",
    category: "trainingskoers",
    date: "2019-05-22T00:00:00.000Z",
    name: "Coureur Maasluis"
  },
  {
    key: "-LfjlZHEWAJPEzWPv6e-",
    category: "trainingskoers",
    date: "2019-05-25T00:00:00.000Z",
    name: "Ahoy Funklasse"
  },
  {
    key: "-Lfmyvi5x6EueGoMDm-h",
    category: "criterium",
    date: "2019-05-25T00:00:00.000Z",
    name: "Ronde van Groot Ammers"
  },
  {
    key: "-LfoOdeSfAtrd5tZZGrH",
    category: "criterium",
    date: "2019-05-25T00:00:00.000Z",
    name: "Ronde van Katendrecht"
  },
  {
    key: "-LfpvhMQf7VApE_UDFu5",
    category: "offRoadRegional",
    date: "2019-05-26T00:00:00.000Z",
    name: "MTB ZH: Spartaan "
  },
  {
    key: "-Lfsb4sH_CGQWrvhHiEJ",
    category: "trainingskoers",
    date: "2019-05-09T00:00:00.000Z",
    name: "Ahoy donderdag"
  },
  {
    key: "-Lg-Gn8zmXWNh7AENXgw",
    category: "trainingskoers",
    date: "2019-05-21T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-Lg-GvSaerp22GCajJ8e",
    category: "trainingskoers",
    date: "2019-05-28T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-Lg47CzjUrKzfsvqGBzp",
    category: "wtos",
    date: "2019-05-29T00:00:00.000Z",
    name: "WTOS 10km TT Mei"
  },
  {
    key: "-LgJcZOqR90bF4Jccp79",
    category: "criterium",
    date: "2019-06-01T00:00:00.000Z",
    name: "Wageningse muur"
  },
  {
    key: "-Lh-56S_Z_-uVOIPqbbm",
    category: "cyclosportive",
    date: "2019-06-08T00:00:00.000Z",
    name: "Trois Ballons"
  },
  {
    key: "-Lh0i_qg0HmAQXW1hKB8",
    category: "omloop",
    date: "2019-06-10T00:00:00.000Z",
    name: "DK Oost"
  },
  {
    key: "-Lh5RdagnpPXOE4aUsP5",
    category: "criterium",
    date: "2019-06-10T00:00:00.000Z",
    name: "DK Zuid Holland"
  },
  {
    key: "-LhEz9U98yTzR9wVQ1ha",
    category: "wtos",
    date: "2019-06-12T00:00:00.000Z",
    name: "La Duo"
  },
  {
    key: "-LhHOjwBXWqHza21I2U0",
    category: "criterium",
    date: "2019-06-13T00:00:00.000Z",
    name: "Dorpsronde van Rijsenhout"
  },
  {
    key: "-LhVNpHwLgFiJjSlkrDU",
    category: "toertocht",
    date: "2019-06-15T00:00:00.000Z",
    name: "Limburgs mooiste"
  },
  {
    key: "-LhW9jAdrouTGxBnDxg7",
    category: "criterium",
    date: "2019-06-15T00:00:00.000Z",
    name: "Ronde van Heijplaat"
  },
  {
    key: "-Lh_DPUnq3g40AeLc470",
    category: "cyclosportive",
    date: "2019-06-16T00:00:00.000Z",
    name: "Bartje200"
  },
  {
    key: "-LhiitHplknJhku32TR5",
    category: "criterium",
    date: "2019-06-16T00:00:00.000Z",
    name: "Ronde van Zoeterwoude"
  },
  {
    key: "-Lhij-sWvlbjvcAwPyx8",
    category: "criterium",
    date: "2019-06-18T00:00:00.000Z",
    name: "Ronde van Maassluis"
  },
  {
    key: "-Li7VUtd0tRHEHIc0z1s",
    category: "criterium",
    date: "2019-06-23T00:00:00.000Z",
    name: "Ronde van Nieuw Vennep"
  },
  {
    key: "-Li7a0zVfV6_BHfoB207",
    category: "classic",
    date: "2019-06-22T00:00:00.000Z",
    name: "Luba Ladies Classic"
  },
  {
    key: "-Li7aAlULYhOfs24oqqk",
    category: "timetrial",
    date: "2019-06-15T00:00:00.000Z",
    name: "Roden - Ploegentijdrit"
  },
  {
    key: "-Li7aHb57AWmsfNI7Dmd",
    category: "criterium",
    date: "2019-06-15T00:00:00.000Z",
    name: "Roden - Criterium"
  },
  {
    key: "-Li7aQwiTcbgaL4abYXS",
    category: "classic",
    date: "2019-06-16T00:00:00.000Z",
    name: "Roden - Klassieker"
  },
  {
    key: "-Li7mrDe6JBxyTHp0qIe",
    category: "offRoadRegional",
    date: "2019-06-22T00:00:00.000Z",
    name: "MTB Cup ZH Noordwijk Streetrace"
  },
  {
    key: "-LiHmOJwPi02MCWbJ_lV",
    category: "trainingskoers",
    date: "2019-06-25T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LiNzkGSR-gmPl4QsySx",
    category: "wtos",
    date: "2019-06-26T00:00:00.000Z",
    name: "WTOS 10km TT Juni"
  },
  {
    key: "-LiXZE_k6-M5KBnLf3Bf",
    category: "wtos",
    date: "2019-05-28T00:00:00.000Z",
    name: "CK MTB"
  },
  {
    key: "-LiXip4-yFNGavfnwEaV",
    category: "criterium",
    date: "2019-06-28T00:00:00.000Z",
    name: "Ronde van Ede"
  },
  {
    key: "-LigawXy34h8iM2vwuUZ",
    category: "criterium",
    date: "2019-05-12T00:00:00.000Z",
    name: "Ronde van Woerden"
  },
  {
    key: "-LigbAybJTaiuS9pswQg",
    category: "classic",
    date: "2019-05-25T00:00:00.000Z",
    name: "Omloop Hoeksche Waard"
  },
  {
    key: "-LigbKIwjP1PSwgH5CkU",
    category: "trainingskoers",
    date: "2019-05-30T00:00:00.000Z",
    name: "Ronde van Lekkerkerk"
  },
  {
    key: "-LigbSTrsbO7y9WelLZz",
    category: "criterium",
    date: "2019-05-30T00:00:00.000Z",
    name: "Ronde van Lekkerkerk"
  },
  {
    key: "-Ligc0Hjk7XcHe254O3u",
    category: "criterium",
    date: "2019-06-01T00:00:00.000Z",
    name: "Ronde van Papendrecht"
  },
  {
    key: "-LigcEtFvhAQVMTpnVpR",
    category: "criterium",
    date: "2019-06-15T00:00:00.000Z",
    name: "Ronde van Ouderkerk - Ronde Hoep"
  },
  {
    key: "-LigcOxH4BJ5vbL9Iigp",
    category: "criterium",
    date: "2019-06-16T00:00:00.000Z",
    name: "Ronde van Zoeterwoude"
  },
  {
    key: "-LigcgITSHlzFtEAD2ju",
    category: "criterium",
    date: "2019-06-29T00:00:00.000Z",
    name: "Rond om de Graaf"
  },
  {
    key: "-Ligcq3IFObPS9JUkc1_",
    category: "criterium",
    date: "2019-06-30T00:00:00.000Z",
    name: "Ronde van de Leren Zool (Rijen)"
  },
  {
    key: "-Ligd3FqsuKkzfX9N1K3",
    category: "omloop",
    date: "2019-06-23T00:00:00.000Z",
    name: "Omloop van de Heidehof"
  },
  {
    key: "-Ligdv5noqlHUThgIpwM",
    category: "cyclosportive",
    date: "2019-05-19T00:00:00.000Z",
    name: "Granfondo Vosges"
  },
  {
    key: "-LioGXVmn5xUYWkQxKEP",
    category: "trainingskoers",
    date: "2019-07-02T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LjAaR7KY2fq9Q_QqI64",
    category: "criterium",
    date: "2019-07-04T00:00:00.000Z",
    name: "Slag van Ambacht "
  },
  {
    key: "-Ljf_Ys_qBNvfEsIyF6g",
    category: "criterium",
    date: "2019-07-06T00:00:00.000Z",
    name: "Ronde van Middelharnis"
  },
  {
    key: "-Ljf_n-8rXUCSYBk5b-q",
    category: "criterium",
    date: "2019-07-13T00:00:00.000Z",
    name: "Ronde van Abbenbroek"
  },
  {
    key: "-LjoZGwEBuN-wh76QbSb",
    category: "cyclosportive",
    date: "2019-07-07T00:00:00.000Z",
    name: "Engadin Radmarathon"
  },
  {
    key: "-LjpgPVGEccqjuGUldgu",
    category: "cyclosportive",
    date: "2019-06-16T00:00:00.000Z",
    name: "Alpenchallenge Lenzerheide"
  },
  {
    key: "-LjpggRPPJbbcV2a7Svh",
    category: "timetrial",
    date: "2019-06-26T00:00:00.000Z",
    name: "Dornier Cup Ahausen TT"
  },
  {
    key: "-LjpgqZ63ySAjKS4dQqk",
    category: "timetrial",
    date: "2019-01-01T00:00:00.000Z",
    name: "Opening Hochsten TT"
  },
  {
    key: "-Ljv1y3-S_LLa_EjhSa0",
    category: "NK",
    date: "2019-07-13T00:00:00.000Z",
    name: "NSK Tijdrijden"
  },
  {
    key: "-Lk-2Sr_6Mv-FoyhUJw9",
    category: "trainingskoers",
    date: "2019-07-16T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-Lk9EvmibkMBabMOxAxL",
    category: "criterium",
    date: "2019-07-17T00:00:00.000Z",
    name: "Ronde van 's-Gravenzande"
  },
  {
    key: "-LkEKFNaUq0bHfOcKkAz",
    category: "NK",
    date: "2019-07-20T00:00:00.000Z",
    name: "NK MTB Sittard "
  },
  {
    key: "-LkJ9DkJU8krQw1jMXLo",
    category: "zomoco",
    date: "2019-07-21T00:00:00.000Z",
    name: "ZoMoCo Ahoy"
  },
  {
    key: "-LkZij0Vkoo0Xzmf46wE",
    category: "trainingskoers",
    date: "2019-07-23T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LknttDMEYYcZJ5Xkz1D",
    category: "toertocht",
    date: "2019-07-27T00:00:00.000Z",
    name: "Flipjes Toertocht"
  },
  {
    key: "-LkuGVLmIeRqtsboRuoa",
    category: "criterium",
    date: "2019-07-28T00:00:00.000Z",
    name: "Ronde van Poeldijk"
  },
  {
    key: "-Ll3GmvkXHogpQv5DRY1",
    category: "timetrial",
    date: "2019-07-24T00:00:00.000Z",
    name: "Dornier Cup Heiligenberg TT"
  },
  {
    key: "-Ll7wRYiOwI1zgPLyGc-",
    category: "other",
    date: "2019-07-27T00:00:00.000Z",
    name: "Rad am Ring 24h"
  },
  {
    key: "-Ll8YpgxwB1fhh5zQOqi",
    category: "cyclosportive",
    date: "2019-07-29T00:00:00.000Z",
    name: "La Chambérienne"
  },
  {
    key: "-Ll8ZiyoDjwvkJf7QRoT",
    category: "criterium",
    date: "2019-07-07T00:00:00.000Z",
    name: "Ronde van Hoogkarspel"
  },
  {
    key: "-LlGRRE_QDlnv38Vd3R0",
    category: "cyclosportive",
    date: "2019-07-27T00:00:00.000Z",
    name: "Rad am Ring"
  },
  {
    key: "-LlT-ImboQuBg0bn5VMu",
    category: "criterium",
    date: "2019-08-04T00:00:00.000Z",
    name: "wielerronde van oostzaan"
  },
  {
    key: "-LlT0JjAjzQ6h9haSiwg",
    category: "criterium",
    date: "2019-07-31T00:00:00.000Z",
    name: "Ronde van Santpoort"
  },
  {
    key: "-LlT0acfUpzlM_id8_EU",
    category: "criterium",
    date: "2019-07-24T00:00:00.000Z",
    name: "paardenmarkt ronde van Alblasserdam"
  },
  {
    key: "-LlT0mNgfC7w0xJj8bGo",
    category: "criterium",
    date: "2019-07-20T00:00:00.000Z",
    name: "Ronde van barendrecht"
  },
  {
    key: "-LlT1Wv379x68uiEyWN-",
    category: "zomoco",
    date: "2019-07-28T00:00:00.000Z",
    name: "zomoco spartaan"
  },
  {
    key: "-LlTGl1CLi-dHM0g4vBA",
    category: "criterium",
    date: "2019-08-01T00:00:00.000Z",
    name: "Profronde Westland"
  },
  {
    key: "-LlY1hiTIxzMkd4j7571",
    category: "cyclosportive",
    date: "2019-08-04T00:00:00.000Z",
    name: "Arlberg Giro"
  },
  {
    key: "-LlsiirIisAoq8GSndcO",
    category: "criterium",
    date: "2019-08-08T00:00:00.000Z",
    name: "Ronde van Nootdorp"
  },
  {
    key: "-LlviD0H-gSfgT5umQQU",
    category: "trainingskoers",
    date: "2019-07-18T00:00:00.000Z",
    name: "Ahoy donderdagavond"
  },
  {
    key: "-LlviX07kW8TSNUAb4Xo",
    category: "trainingskoers",
    date: "2019-06-11T00:00:00.000Z",
    name: "ZAC de spartaan"
  },
  {
    key: "-LlvixKnCd0xB0BS9lzV",
    category: "trainingskoers",
    date: "2019-05-16T00:00:00.000Z",
    name: "ZAC de bollenstreek"
  },
  {
    key: "-Lm0fcyQcOOMDd39kXVJ",
    category: "cyclosportive",
    date: "2019-08-11T00:00:00.000Z",
    name: "Highlander Radmarathon"
  },
  {
    key: "-LmBohn5Va-SrT8PxAH6",
    category: "trainingskoers",
    date: "2019-08-13T00:00:00.000Z",
    name: "Dinsdag Ahoy"
  },
  {
    key: "-LmEQMGUrGtypYBla8eZ",
    category: "criterium",
    date: "2019-08-08T00:00:00.000Z",
    name: "Ronde van Oostvoorne"
  },
  {
    key: "-Ln7OuCrDY4eIV2jkoCx",
    category: "criterium",
    date: "2019-08-24T00:00:00.000Z",
    name: "Ronde van Zuidland"
  },
  {
    key: "-Ln96cZ2rPtNqyDwmlby",
    category: "offRoadNational",
    date: "2019-08-25T00:00:00.000Z",
    name: "3 Nations Cup Zoetermeer"
  },
  {
    key: "-Ln9710uYbsXAPmRW87q",
    category: "criterium",
    date: "2019-08-25T00:00:00.000Z",
    name: "Ronde van Delfzijl "
  },
  {
    key: "-LnX1V8XeDzr2x7NflDJ",
    category: "trainingskoers",
    date: "2019-08-27T00:00:00.000Z",
    name: "ZAC Spartaan "
  },
  {
    key: "-LntSYyF-3t7TIpCxbdE",
    category: "wtos",
    date: "2019-08-28T00:00:00.000Z",
    name: "10 km TT augustus"
  },
  {
    key: "-LntSniJx7E4XJBX14GV",
    category: "trainingskoers",
    date: "2019-09-04T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-LnvP_th1HYnLogS-MEm",
    category: "omloop",
    date: "2019-09-01T00:00:00.000Z",
    name: "Gerben Kroes Omloop Blijham"
  },
  {
    key: "-LnwQkfjf-Brql-77PVo",
    category: "zomoco",
    date: "2019-09-01T00:00:00.000Z",
    name: "ZoMoCo De Coureur"
  },
  {
    key: "-LoHoWy__BR6W74HBdAH",
    category: "omloop",
    date: "2019-09-08T00:00:00.000Z",
    name: "Omloop van de Bollenstreek"
  },
  {
    key: "-LoMNpkwf1g1v-sqKIPB",
    category: "wtos",
    date: "2019-09-08T00:00:00.000Z",
    name: "WTOS CK weg"
  },
  {
    key: "-LoPh96aA43IadESG9zW",
    category: "trainingskoers",
    date: "2019-08-15T00:00:00.000Z",
    name: "Donderdag ahoy"
  },
  {
    key: "-LoPhdQW1Q1s6oeBH1Fo",
    category: "trainingskoers",
    date: "2019-07-21T00:00:00.000Z",
    name: "Zondagmorgen de Kampioen"
  },
  {
    key: "-LofxTUtPXU-U7ig2NZ6",
    category: "trainingskoers",
    date: "2019-09-10T00:00:00.000Z",
    name: "ZAC Spartaan"
  },
  {
    key: "-Lopshnt5ocoBOX4DUf0",
    category: "criterium",
    date: "2019-09-15T00:00:00.000Z",
    name: "Ronde van Hillegom"
  },
  {
    key: "-LotNhLZSVNYXizBd8qB",
    category: "studentencup",
    date: "2019-09-14T00:00:00.000Z",
    name: "Ronde van de grote beek"
  },
  {
    key: "-LpP6kRmeCMS7kyYEin_",
    category: "criterium",
    date: "2019-09-14T00:00:00.000Z",
    name: "Ronde van Voorhout"
  },
  {
    key: "-LpP6tTRdqppFpyIywYt",
    category: "criterium",
    date: "2019-09-22T00:00:00.000Z",
    name: "Ronde van Lisse"
  },
  {
    key: "-LpP7BfJZ0rcyNYeOzgw",
    category: "offRoadNational",
    date: "2019-09-21T00:00:00.000Z",
    name: "Marathon Oldebroek"
  },
  {
    key: "-LpP7SqvhtNPOUco1-oc",
    category: "wtos",
    date: "2019-09-18T00:00:00.000Z",
    name: "La Ultimo"
  },
  {
    key: "-LpPdDfRzWAIRtM3UGJK",
    category: "NK",
    date: "2019-09-22T00:00:00.000Z",
    name: "NSK Wielrennen"
  },
  {
    key: "-Lq0FScF8kgb406pRRF4",
    category: "NK",
    date: "2019-09-30T00:00:00.000Z",
    name: "NCK Ploegen tijdrit"
  },
  {
    key: "-LqRwSc4k9zXcS7QXrXc",
    category: "trainingskoers",
    date: "2019-09-19T00:00:00.000Z",
    name: "Dropkoers-Corpus"
  },
  {
    key: "-LqRwcu8XJnxDMAGgnEZ",
    category: "offRoadRegional",
    date: "2019-10-05T00:00:00.000Z",
    name: "ICW Gasselte "
  },
  {
    key: "-LqjsxkyKfvWBEfH2SyX",
    category: "criterium",
    date: "2019-09-28T00:00:00.000Z",
    name: "Ronde van Rotterdam Noord"
  },
  {
    key: "-LrT5jPpkOfS_K1iESLd",
    category: "criterium",
    date: "2019-08-27T00:00:00.000Z",
    name: "Ronde van Naaldwijk"
  },
  {
    key: "-LrT5uBoerMF1xGD7ob_",
    category: "criterium",
    date: "2019-08-25T00:00:00.000Z",
    name: "Ronde van Uithoorn"
  },
  {
    key: "-LsIyzizG5dLIi-ZKzUt",
    category: "NK",
    date: "2019-09-29T00:00:00.000Z",
    name: "Bart Brentjens challenge NK marathon  "
  },
  {
    key: "-LsIzLGyreDD_UyLbB31",
    category: "omloop",
    date: "2019-09-01T00:00:00.000Z",
    name: "Omloop van het zuiderpark "
  },
  {
    key: "-Lsgs_-nejzoe5mgTkK8",
    category: "offRoadRegional",
    date: "2019-11-02T00:00:00.000Z",
    name: "WTOS Regiocross"
  },
  {
    key: "-LtyUB6JewgSZ7ecMtU7",
    category: "toertocht",
    date: "2019-11-17T00:00:00.000Z",
    name: "TT vlodrop"
  },
  {
    key: "-LuXi7bnWSy92cyKBH-r",
    category: "offRoadRegional",
    date: "2019-11-24T00:00:00.000Z",
    name: "Subaru Beach batlle"
  },
  {
    key: "-LufsYU8mS28XEtBqQik",
    category: "toertocht",
    date: "2019-11-24T00:00:00.000Z",
    name: "Meet The Boerenkool"
  },
  {
    key: "-LvlZ3Fe32xScrAz4nHU",
    category: "wtos",
    date: "2019-12-08T00:00:00.000Z",
    name: "CK cross"
  },
  {
    key: "-Lw4T1NPBSV2GzSNPQZo",
    category: "offRoadRegional",
    date: "2019-12-14T00:00:00.000Z",
    name: "Regiocross de Mol"
  },
  {
    key: "-LwgZLkudXR3fFE_NDB6",
    category: "offRoadRegional",
    date: "2019-12-21T00:00:00.000Z",
    name: "Regiocross AHOY"
  },
  {
    key: "-Lx2DAvNZ5N2ohf34WhW",
    category: "offRoadRegional",
    date: "2019-12-26T00:00:00.000Z",
    name: "Regiocross Swift"
  },
  {
    key: "-LxFXnyulqSkvQS7YR9v",
    category: "toertocht",
    date: "2019-12-22T00:00:00.000Z",
    name: "ATB Tocht Diever"
  }
];
