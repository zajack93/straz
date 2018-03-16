var Map = Class.create();
Map.prototype = {
    initialize: function(element, button, content) {
        this.element = $(element);
        this.button = $(button);
        this.content = $(content);
        this.button.observe('click', function(event) {
            this.narysujTabele();
        }.bind(this));
    },
    pobierzDane: function() {
        var json = false;

        try {
            json = JSON.parse(this.element.getValue());
        } catch (e) {
            alert('Wymagany format danych to JSON');
        }

        return json;
    },
    pobierzMiasta: function() {
        if (this.pobierzDane().miasta != undefined) {
            return this.pobierzDane().miasta;
        }

        return false;
    },
    pobierzDrogi: function() {
        if (this.pobierzDane().drogi != undefined) {
            return this.pobierzDane().drogi;
        }

        return false;
    },
    pobierzMaxCzasPrzejadu: function() {
        if (this.pobierzDane().max_czas_przejazdu != undefined) {
            return parseInt(this.pobierzDane().max_czas_przejazdu);
        }
    },
    narysujTabele: function() {
        var tableProto = new Element('table'),
            miasta = this.pobierzMiasta(),
            droga = 0,
            html = '<td>-</td>';

        miasta.forEach(function(miasto) {
            var nazwa = this.udekorujNazweMiasta(miasto);
            html = html + '<td>' + nazwa + '</td>';
        }.bind(this));

        tableProto.insert(html);

        for (var i=0;i<miasta.length;i++) {
            var nazwa = this.udekorujNazweMiasta(miasta[i]);
            html = '<td>' + nazwa + '</td>';
            for (var j=0;j<miasta.length;j++) {
                if (i == j) {
                    html = html + '<td>-</td>';
                } else {
                    droga = this.obliczDroge(
                        miasta[i].nazwa,
                        miasta[j].nazwa
                    );

                    html = html + '<td>' + this.udekorujDroge(droga) + '</td>';
                }
            }
            tableProto.insert(html);
        }

        this.content.update(tableProto);
    },
    obliczDroge: function(miastoStart, miastoDest) {
        var drogi = this.pobierzDrogi(),
            czasPrzejazdu = 0,
            miastoPosrednie = '';

        for (var i=0;i<drogi.length;i++) {
            var miasta = drogi[i].miasta;
            if (miasta.indexOf(miastoStart) > -1) {
                if (miasta.indexOf(miastoDest) > -1) {
                    return drogi[i].czas_przejazdu;
                }

                miastoPosrednie = miasta[0];
                czasPrzejazdu = drogi[i].czas_przejazdu;
            }
        }

        for (i = 0; i < drogi.length; i++) {
            miasta = drogi[i].miasta;
            if (miasta.indexOf(miastoPosrednie) > -1
                && miasta.indexOf(miastoDest) > -1) {
                return (czasPrzejazdu + drogi[i].czas_przejazdu);
            }
        }

        return czasPrzejazdu;
    },
    udekorujNazweMiasta: function(miasto) {
        var nazwa = miasto.nazwa;
        if (miasto.ma_jednostke) {
            nazwa = '<span style="color:green">' + nazwa + '</span>';
        }
        return nazwa;
    },
    udekorujDroge: function(wartosc) {
        if (wartosc > this.pobierzMaxCzasPrzejadu()) {
            wartosc  = '<span style="color:red">' + wartosc + '</span>';
        }
        return wartosc;
    }
};
